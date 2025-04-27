const e=`---
id: 11
title: "Building a Scala 3 LSP Server - Part 7"
description: "Optimizing AI Completions for Low Latency"
publishedDate: 2025-06-03
image: lsp07.jpg
previous: 10
next: 12
keywords:
  - Scala 3
  - LSP
  - IDE
  - AI Optimization
  - Low Latency
  - Asynchronous Programming
---

Welcome to the seventh part of this LSP series. In the previous article (Part 6), we integrated AI capabilities into our LSP server to enhance code completion with intelligent tabstop suggestions. However, we ran into a significant challenge: performance. The AI-enhanced completions caused the IDE to freeze for about 1.5 seconds while waiting for responses from the Gemini API.

If you haven't read Part 6 yet, I highly recommend checking it out first, as this article builds directly on the AI integration techniques we established there. We'll now focus on optimizing those AI completions to achieve a responsive, low-latency user experience.

📦 [**View the source code on GitHub**](https://github.com/smart-data-lake/sdl-lsp) – Explore the complete implementation. Leave a star if you like it!

## The Latency Problem

Even though we're now able to generate AI-enhanced templates, we make the IDE freeze for about 1.5 seconds before showing the list of possible completion items to users. This creates several problems:

![ai completion issues](\${baseUrl}blog-images/aicompletionissues.png)

1. **Poor user experience**: A 1.5-second delay feels sluggish and disrupts the flow of coding
2. **IDE timeouts**: Some IDEs won't even wait for the answer and will send a \`cancelRequest\` event, resulting in an empty completion list
3. **Resource exhaustion**: If the user retries multiple times, they might exhaust the thread pool connection, leading to deadlocks and completely freezing the server

## The Two-Phase Completion Solution

Fortunately, the LSP protocol provides a solution through the \`completionItem/resolve\` event. This allows us to implement a two-phase completion process:

![code completion flow chart](\${baseUrl}blog-images/completionflowchart.png)

Here's how the improved workflow works:

![1. **Phase 1 - Initial Completion Request**: - The client requests completion items with \`textDocument/completion\` - The server responds immediately with basic rule-based templates - The server also starts asynchronously computing AI-enhanced versions in the background](\${baseUrl}blog-images/phase1initialcompletionrequest.png)

![2. **Phase 2 - Resolution Phase**:- When the user selects a specific item from the list, the client sends a \`completionItem/resolve\` request - The server checks if the AI-enhanced version is ready and returns it - If the enhancement isn't ready yet, the server returns the original rule-based item](\${baseUrl}blog-images/phase2resolutionresized.PNG)

This approach gives us the best of both worlds: instant response for the initial list while still delivering AI enhancements when the user makes a selection. The second phase can also feel instant if the user hesitate at least 1.5 seconds before making their choice.

## Implementation: Optimizing TextDocumentService

Let's start by refactoring our \`TextDocumentService\` to implement this two-phase approach:

\`\`\`scala
class SmartDataLakeTextDocumentService(
      private val completionEngine: SDLBCompletionEngine,
      private val hoverEngine: SDLBHoverEngine,
      private val aiCompletionEngine: AICompletionEngine)(using ExecutionContext)
      extends TextDocumentService
      with WorkspaceContext with ClientAware with SDLBLogger:
      
  private var uriToContexts: Map[String, SDLBContext] = Map.empty
  private val precomputedCompletions: TrieMap[String, Future[String]] = TrieMap.empty

  override def completion(params: CompletionParams): CompletableFuture[messages.Either[util.List[CompletionItem], CompletionList]] = Future {
    val uri = params.getTextDocument.getUri
    val context = uriToContexts(uri)
    val caretContext = context.withCaretPosition(params.getPosition.getLine+1, params.getPosition.getCharacter)
    val completionItems: List[CompletionItem] = completionEngine.generateCompletionItems(caretContext)
    val formattedCompletionItems = completionItems.map(formattingStrategy.formatCompletionItem(_, caretContext, params))
    
    if aiCompletionEngine.isEnabled then
      precomputedCompletions.clear()
      formattedCompletionItems.foreach(generateAICompletions)
    
    Left(formattedCompletionItems.toJava).toJava
  }.toJava

  private def generateAICompletions(item: CompletionItem): Unit =
    Option(item.getData).map(_.toString).flatMap(CompletionData.fromJson).filter(_.withTabStops).foreach { data =>
      val result = aiCompletionEngine
        .generateInsertTextWithTabStops(item.getInsertText, data.parentPath, data.context)
        .recover {
          case ex: Exception =>
            debug(s"AI inference error: \${ex.getMessage}")
            item.getInsertText // Fallback to original text
        }
      precomputedCompletions += (item.getInsertText -> result)
    }
\`\`\`

Key aspects of this implementation:

![- **Concurrent Map**: We use a \`TrieMap\`, Scala's concurrent hash map implementation, to safely store and access completion futures from multiple threads - **Cleaner Indentation**: We leverage Scala 3's new indentation syntax to make the code more readable by starting directly with \`Future {\` making the method code block still feel clean as in scala 2. - **Immediate Response**: The initial completion request returns immediately with rule-based suggestions - **Background Processing**: For each completion item with tabstops, we create a Future that calls Gemini and store it in the concurrent map - **Map Clearing**: We clear the concurrent map whenever a new completion request is made to avoid accumulating stale computations](\${baseUrl}blog-images/keyaspectsaicompletionpart7.png)

## Implementing the Resolve Method

Now let's implement the \`resolveCompletionItem\` method that handles the second phase of our two-phase completion:

\`\`\`scala
override def resolveCompletionItem(completionItem: CompletionItem): CompletableFuture[CompletionItem] = Future {
    if aiCompletionEngine.isEnabled then
      
      Option(completionItem.getData).map(_.toString).flatMap(CompletionData.fromJson).foreach { data =>
        if data.withTabStops then
          precomputedCompletions.get(completionItem.getInsertText) match
            case Some(future) =>
              Try {
                // Try to get result with timeout
                val result = Await.result(future, 3000.milliseconds)
                completionItem.setInsertText(result)
                completionItem.setInsertTextMode(InsertTextMode.AdjustIndentation)
              }.recover {
                case _: java.util.concurrent.TimeoutException =>
                  // If timeout, don't modify the insert text - use default
                  debug("AI completion inference timeout, using default completion")
                case ex: Exception =>
                  debug(s"Error during AI completion: \${ex.getMessage}")
              }
            
            case None =>
              val futureInsertText = aiCompletionEngine.generateInsertTextWithTabStops(completionItem.getInsertText, data.parentPath, data.context)
              val insertText = Await.result(futureInsertText, 3000.milliseconds)
              completionItem.setInsertText(insertText)
              completionItem.setInsertTextMode(InsertTextMode.AdjustIndentation)
      }
    
    completionItem
  }.toJava
\`\`\`

The resolve method has a few important aspects:

- **Lookup First**: We first check if we've already started computing an AI-enhanced version of this completion item
- **Timeout Handling**: We set a 3-second timeout to ensure we don't keep the user waiting too long. Here decreasing this timeout should be perfectly fine if you prefer efficiency over possible enhanced completion items
- **Fallback Mechanism**: If the enhanced version isn't ready or an error occurs, we gracefully fall back to the original item
- **On-Demand Computation**: If we don't find a precomputed result (which might happen if the cache was cleared), we can compute it on the spot

This approach ensures that users see the completion list instantly, while still benefiting from AI enhancements when selecting an item. The timeout ensures that even the selection phase doesn't feel sluggish.

## Preventing Thread Pool Exhaustion

Our solution works, but there's still a potential issue: thread pool exhaustion. If the user triggers multiple completion requests without selecting items, we might exhaust the LSP4J thread pool, potentially causing deadlocks.

To solve this, we'll use a separate thread pool dedicated to AI processing. Here's how we can refactor our \`AppModule\`:

\`\`\`scala
trait AppModule:
  // ... other components ...

  val modelClient: ModelClient = new GeminiClient(Option(System.getenv("GOOGLE_API_KEY")))
  lazy val ioExecutorService: ExecutorService = Executors.newCachedThreadPool()
  lazy val ioExecutionContext: ExecutionContextExecutorService = ExecutionContext.fromExecutorService(ioExecutorService)
  val aiCompletionEngine: AICompletionEngineImpl = new AICompletionEngineImpl(modelClient)(using ioExecutionContext)

  lazy val serviceExecutorService: ExecutorService = Executors.newCachedThreadPool()
  lazy val serviceExecutionContext: ExecutionContext & ExecutorService = ExecutionContext.fromExecutorService(serviceExecutorService)
  lazy given ExecutionContext = serviceExecutionContext

  lazy val textDocumentService: TextDocumentService & WorkspaceContext & ClientAware = new SmartDataLakeTextDocumentService(completionEngine, hoverEngine, aiCompletionEngine)
  lazy val workspaceService: WorkspaceService = new SmartDataLakeWorkspaceService
\`\`\`

By creating a dedicated \`ioExecutionContext\` for AI processing, we ensure that AI-related tasks don't compete with core LSP functionality for thread resources. This separation is crucial for maintaining responsiveness.

We also need to make sure we properly shut down both thread pools when the server exits:

\`\`\`scala
private def startServer(in: InputStream, out: PrintStream, clientType: ClientType) = {
  val sdlbLanguageServer: LanguageServer & LanguageClientAware = languageServer

  try
    // ... server initialization ...
  catch
    case NonFatal(ex) =>
      ex.printStackTrace(out)
      error(ex.toString)

  finally
    serviceExecutionContext.shutdownNow()
    serviceExecutorService.shutdownNow()
    ioExecutionContext.shutdownNow()
    ioExecutorService.shutdownNow()
    sys.exit(0)
}
\`\`\`

This ensures that all resources are properly cleaned up when the server shuts down, preventing thread leaks.

## Additional Optimizations

Beyond the two-phase completion approach, there are several other optimizations we could consider:

1. **Resource Limiting**: Cap the number of concurrent AI requests to prevent overwhelming the API
2. **Intelligent Caching**: Cache AI responses for common templates to avoid repeated API calls
3. **Priority Queue**: Process AI enhancements for more likely selections first

These additional optimizations could further improve performance, especially for large projects with many completion options.

## Conclusion

In this article, we've successfully optimized our AI-enhanced code completion system to provide a responsive user experience without sacrificing the power of AI suggestions. By implementing a two-phase completion process and careful thread management, we've addressed the latency challenges inherent in AI-powered features.

Our key accomplishments include:

![1. **Implementing Two-Phase Completion**: Separating the initial quick response from the AI-enhanced resolution 2. **Safe Concurrent Computation**: Using Scala's concurrent collections to manage parallel AI enhancement tasks 3. **Thread Pool Isolation**: Preventing resource exhaustion by isolating AI processing from core LSP functionality 4. **Graceful Degradation**: Ensuring the system still provides useful suggestions even when AI enhancement isn't available](\${baseUrl}blog-images/lsp07summary.png)

These optimizations transform what could have been a frustratingly slow feature into a seamless, responsive experience that genuinely enhances the developer's workflow.

In the next part of our series, we'll explore implementing multi-file context awareness, allowing our LSP server to provide even more intelligent suggestions by understanding relationships between different files in a project.

Stay tuned for "Building a Scala 3 LSP Server - Part 8: Multi-File Context Awareness" where we'll tackle the challenge of making our LSP server understand the bigger picture beyond a single file.`;export{e as default};
