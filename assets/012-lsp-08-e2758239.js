const e=`---
id: 12
title: "Building a Scala 3 LSP Server - Part 8"
description: "Implementing Multi-File Context Awareness"
publishedDate: 2025-06-10
image: lsp08.png
previous: 11
next: 13
keywords:
  - Scala 3
  - LSP
  - IDE
  - Multi-file Awareness
  - Workspace Management
---

Welcome to the eighth part of this LSP series. In our previous articles, we built a fully functional LSP server with AI-augmented code completion and optimized it for low latency. Now we'll tackle one of the most powerful features for configuration files: multi-file context awareness.

When working with complex data pipeline configurations like those in Smart Data Lake Builder, definitions are often spread across multiple files. While our LSP server can already provide intelligent suggestions for a single file, it doesn't yet understand relationships between files. In this article, we'll implement a flexible system for grouping related files into workspaces to provide context-aware suggestions that span multiple files.

📦 [**View the source code on GitHub**](https://github.com/smart-data-lake/sdl-lsp) – Explore the complete implementation. Leave a star if you like it!

## The Need for Multi-File Context Awareness

Now it is time to enable multi-file context awareness. First thing is to specify which files should be grouped together. A simple solution would be to merge all files together, but for the Smart Data Lake Builder case, this might not be the ideal approach. When defining data pipelines in a production environment, users may define multiple environments within the same project to ease code reuse, as some Terraform projects would do.

However, the folder's organization for handling multi-environment might be project-dependent. This is why we should design our approach to be modular so we can implement different strategies easily. We will then implement a parser for the config of the LSP itself in the next and final part, allowing us to define which workspace strategy the user wants as well as customizing the tabstops prompt we defined in part 6, but more on that in a moment. Let's first define four strategies to start, from most useful to more experimental:

### Active Workspace

In this strategy, we define a common folder with all pipeline definitions and other files that are environment specific to become the *active workspace*, the main one. Other config files will be defined in isolated workspaces:

![active workspace highlighted](\${baseUrl}blog-images/activeWorkspaceMultiple.png)

In green, we have the main workspace, the *active* one, and the remaining files are put in isolated workspaces highlighted in other colors.

This requires additional parameters from the user to parametrize this strategy and could be expressed like:

\`\`\`hocon
workspaceType = ActiveWorkspace
workspaceParameters = "activeWorkspace/conf,activeWorkspace/environments/local.conf"
\`\`\`

### Single Workspace

This strategy is quite straightforward: 

![single workspace highlighted](\${baseUrl}blog-images/singleWorkspace.png)

Every file is grouped together in a single workspace, as highlighted in green. No specific parameters are needed.

\`\`\`hocon
workspaceType = SingleWorkspace
\`\`\`

### No Workspace

This one too is quite easy to understand:

![no workspace highlighted](\${baseUrl}blog-images/noWorkspace.png)

Every file is independent of each other. This was the behavior we had until now. No parameters are needed.

\`\`\`hocon
workspaceType = NoWorkspace
\`\`\`

### Root Workspace

This strategy is ideal if your data pipelines have very different definitions between environments, or if you run SDLB in projects that are quite different but need to develop keeping an eye on every project in your IDE at the same time:

![root workspace highlighted](\${baseUrl}blog-images/rootWorkspace.png)

This strategy needs to define where your workspace definitions lie.

\`\`\`hocon
workspaceType = RootWorkspace
workspaceParameters = "rootworkspace/conf"
\`\`\`

## Global Strategy for Multi-File Management

To illustrate how we intend to manage multi-file context awareness, let's take the \`SingleWorkspace\` strategy to simplify the example. Also to keep things not too complex, let's use the \`watched files\` feature of the LSP protocol for now. Let's say that the only events we receive are:

![text document actions,- \`textDocument/didOpen\`: A user opened a file in the IDE - \`textDocument/didChange\`: A user changed the content of a file - \`textDocument/didClose\`: A user closed a file in the IDE - \`textDocument/didSave\`: A user saved a file](\${baseUrl}blog-images/textDocumentActions.png)

In a high-level overview, we want to manage the workspace and all SDLB contexts this way:

![initialize workspace](\${baseUrl}blog-images/initializeworkspace.png)

![file creation](\${baseUrl}blog-images/filecreateworkspace.png)

![file edited](\${baseUrl}blog-images/fileeditworkspace.png)

![file saved](\${baseUrl}blog-images/filesaveworkspace.png)

We need to update our \`TextDocumentService\` accordingly:

\`\`\`scala
override def didOpen(didOpenTextDocumentParams: DidOpenTextDocumentParams): Unit =
  val uri = didOpenTextDocumentParams.getTextDocument.getUri
  val content = didOpenTextDocumentParams.getTextDocument.getText
  insert(uri, content)
  updateWorkspace(uri)

override def didChange(didChangeTextDocumentParams: DidChangeTextDocumentParams): Unit =
  val contentChanges = didChangeTextDocumentParams.getContentChanges
  update(didChangeTextDocumentParams.getTextDocument.getUri, Option(contentChanges).flatMap(_.toScala.headOption).map(_.getText).getOrElse(""))


override def didClose(didCloseTextDocumentParams: DidCloseTextDocumentParams): Unit =
  val uri = didCloseTextDocumentParams.getTextDocument.getUri
  if isUriDeleted(uri) then
    info(s"Detecting deletion of $uri")
    update(uri, "")
  updateWorkspace(uri)

override def didSave(didSaveTextDocumentParams: DidSaveTextDocumentParams): Unit =
  updateWorkspace(didSaveTextDocumentParams.getTextDocument.getUri)
\`\`\`

In other words:
- \`didOpen\` should update all the files related to the workspace of the opened file
- \`didChange\` should only update the given file, avoiding updating all files every time, making the LSP much more efficient.
- \`didClose\` does not tell us if the file was simply closed or deleted, so we need to manually check.
- \`didSave\` should update all files of the given workspace, as it shouldn't happen very often, even with if the autosave mode is enabled in the IDE.

So we already know we want our \`WorkspaceContext\` trait to be able to implement the following methods: \`update\` for updating a single file, \`updateWorkspace\` for updating all the files in a workspace, \`isUriDeleted\` to detect this scenario and of course a \`getContext\`, replacing our \`uriToContextMap\` used to retrieve the context in the completion and hovering methods.

Then we need to refactor the following:

\`\`\`scala
class SmartDataLakeTextDocumentService(/* as before */)(using ExecutionContext)
      extends TextDocumentService
      with WorkspaceContext with ClientAware with SDLBLogger {

  // remove uritToContextMap
  // ... as before ...

override def completion(params: CompletionParams): CompletableFuture[messages.Either[util.List[CompletionItem], CompletionList]] = Future {
    val uri = params.getTextDocument.getUri
    val context = getContext(uri) // refactor here
    val caretContext = context.withCaretPosition(params.getPosition.getLine+1, params.getPosition.getCharacter)
    // ... remaining ...
  }.toJava

// ... remaining ...

\`\`\`

- extends the trait \`WorkspaceContext\` we'll define just below
- use \`getContext\` to retrieve the context instead of using the map

## Implementing the Workspace Model

Before implementing \`WorkspaceContext\`, let's first implement our central data object for this feature, \`Workspace\`:

\`\`\`scala
private[workspace] case class Workspace(name: String, contexts: Map[String, SDLBContext], contents: Map[String, String]) extends SDLBLogger:
    def updateContent(uri: String, newContent: String): Workspace =
        val updatedContents = contents.updated(uri, newContent)
        // Update only active context: not all contexts of the workspace
        val updatedContext = contexts.get(uri)
            .map(_.withText(newContent))
            .getOrElse(SDLBContext.fromText(uri, newContent, updatedContents))
        val updatedContexts = contexts.updated(uri, updatedContext)
        copy(contexts = updatedContexts, contents = updatedContents)

    def withAllContentsUpdated: Workspace =
        // Update all context of the workspace
        val newContexts = contexts.map { case (uri, context) =>
            uri -> context.withContents(contents)
        }
        trace(s"Updating all contexts (\${contexts.size}) of workspace $name")
        copy(contexts = newContexts)
\`\`\`

Here we defined a case class scoped to our package feature workspace, with the following methods:

- \`updateContent\`: updates only the given uri and the shared \`contents\` map, but don't update every context yet
- \`withAllContentsUpdated\`: update the reference to the \`contents\` map to every context of the workspace

Also, notice we need now to call \`SDLBContext.fromText\` with two additional parameters: \`uri\` and \`contents\`. We'll refactor this class accordingly at the end.

## The WorkspaceContext Trait

Now we're ready to implement the \`WorkspaceContext\` class:

\`\`\`scala
trait WorkspaceContext extends SDLBLogger:
    private var uriToWorkspace: Map[String, Workspace] = Map.empty

    // To be defined shortly
    private var workspaceStrategy: WorkspaceStrategy = SingleWorkspace()

    def getContext(uri: String): SDLBContext =
        uriToWorkspace(uri).contexts(uri)

    def insert(uri: String, text: String): Unit =
        trace(s"Insertion: Checking context for $uri")
        if !uriToWorkspace.contains(uri) then
            val workspace = workspaceStrategy
                .retrieve(uri, uriToWorkspace.values.toList)
                .updateContent(uri, text)
            trace(s"New context detected: $workspace")
            uriToWorkspace = uriToWorkspace.updated(uri, workspace)
        else
            debug(s"Existing workspace \${uriToWorkspace(uri).name} for $uri")


    def update(uri: String, contentChanges: String): Unit =
        trace(s"Updating context for $uri")
        val workspace = uriToWorkspace(uri)
        uriToWorkspace = uriToWorkspace.updated(uri, workspace.updateContent(uri, contentChanges))

    def updateWorkspace(uri: String): Unit =
        require(uriToWorkspace.contains(uri), s"URI $uri not found in workspaces")
        val workspace = uriToWorkspace(uri)
        val updatedWorkspace = workspace.withAllContentsUpdated
        uriToWorkspace = uriToWorkspace.map { case (uri, ws) => ws match
            case v if v.name == workspace.name => uri -> updatedWorkspace
            case v => uri -> v
        }


    def initializeWorkspaces(rootUri: String): Unit =
        val rootPath = path(rootUri)

        if Files.exists(rootPath) && Files.isDirectory(rootPath) then
            val configFiles = Files.walk(rootPath)
                .filter(path => Files.isRegularFile(path) && path.toString.endsWith(".conf"))
                .toScala

            val contents = configFiles.map { file => file.toUri().toString() ->
                Try {
                    val text = Files.readString(file)
                    if SDLBContext.isConfigValid(text) then
                        text
                    else
                        warn(s"Invalid config file: \${file.toUri().toString()}")
                        ""
                }.getOrElse("")
            }.toMap
            
            // Fix a workspace strategy for now. Will be configurable in next part
            workspaceStrategy = WorkspaceStrategy(rootUri, "SingleWorkspace", "")
            info(s"Using workspace strategy: $workspaceType with parameters: $workspaceParameters")

            info(s"loaded \${contents.size} config files from $rootUri")
            uriToWorkspace = workspaceStrategy.buildWorkspaceMap(rootUri, contents)
            debug(s"Initialized workspaces: \${uriToWorkspace.map((key, v) => key.toString + " -> " + v.contexts.size).mkString("\\n", "\\n", "")}")

    def isUriDeleted(uri: String): Boolean = !Files.exists(path(uri))
\`\`\`

There are several key design elements in this implementation:

![key element workspace management,](\${baseUrl}blog-images/keyElementsWorkspaceManagement.png)

1. **Resilient File Loading**: In the \`initializeWorkspaces\` method, we wrap the file reading in a \`Try\` block and check if each config is valid using \`SDLBContext.isConfigValid\`. This ensures that invalid configuration files don't crash the server—they're simply ignored with a warning.

2. **Dynamic Workspace Strategy**: The trait is designed to work with any workspace strategy implementation. Currently, we're hardcoding \`SingleWorkspace\` but in a future article, we'll make this configurable.

3. **Efficient Updates**: The \`update\` method only updates a single file's context, while \`updateWorkspace\` updates all contexts in a workspace. This balance allows for efficient editing while maintaining consistency across related files.

4. **URI Validation**: We check for existence and validity of URIs at various points to prevent errors. The \`isUriDeleted\` method helps us distinguish between a closed file and a deleted one.

## Implementing Workspace Strategies

Now we need to implement a \`WorkspaceStrategy\` trait that will easily enable us choosing the implementation at runtime:

\`\`\`scala
trait WorkspaceStrategy:
    
    def retrieve(uri: String, workspaces: List[Workspace]): Workspace

    protected def groupByWorkspaces(rootUri: String, contents: Map[String, String]): Map[String, Map[String, String]]

    def buildWorkspaceMap(rootUri: String, contents: Map[String, String]): Map[String, Workspace] =
        groupByWorkspaces(rootUri, contents).flatMap { case (workspaceName, contents) =>
            val contexts = contents.map { case (uri, content) =>
                uri -> SDLBContext.fromText(uri, content, contents)
            }
            val ws = Workspace(workspaceName, contexts, contents)
            contexts.map { case (uri, _) =>
                uri -> ws
            }
        }

object WorkspaceStrategy:
    def apply(rootUri: String, workspaceType: String, workspaceParameters: String): WorkspaceStrategy = workspaceType.toLowerCase().trim() match
        case "rootworkspace" => RootWorkspace(rootUri, workspaceParameters)
        case "activeworkspace" => ActiveWorkspace(workspaceParameters)
        case "singleworkspace" => SingleWorkspace()
        case "noworkspace" => NoWorkspace()
        case _ => throw new IllegalArgumentException(s"Unknown workspace type: $workspaceType")
\`\`\`

Key points:
- Forcing implementation to give a \`retrieve\` strategy: when the uri is not currently in the map, we need to implement an algorithm that will depend on the strategy
- Using the *template method pattern*, one of my favorite, to define a general algorithm for building the initial workspaces. Every implementers only need to focus on a method called \`groupByWorkspaces\`
- Leveraging the companion object in Scala to define our \`Factory\`: \`object\`s in scala are guaranteed to be instantiated only once in the JVM.

For demonstration purpose, we will only see one of the implementation here. While \`ActiveWorkspace\` should be the default behavior for SDLB's users, we will present \`SingleWorkspace\` to stay consistent with past examples:

\`\`\`scala
class SingleWorkspace extends WorkspaceStrategy with SDLBLogger:

  override def retrieve(uri: String, workspaces: List[Workspace]): Workspace =
    warn(s"RootURI as a single workspace should handle all case. Abnormal call to method 'retrieve' with $uri")
    val contents = Map(uri -> "")
    Workspace(
        uri,
        Map(uri -> SDLBContext.fromText(uri, "", contents)),
        contents)

  override def groupByWorkspaces(rootUri: String, contents: Map[String, String]): Map[String, Map[String, String]] =
    Map(rootUri -> contents)
\`\`\`

This strategy should actually never have its \`retrieve\` method called, because we should always match the same workspace having as prefix the root uri of the project, as shown in \`groupByWorkspaces\`. However, if that happens, we know how to handle it, so we prefer to log a warning instead and implement it nevertheless.

## Enhancing the Core Components

Now is time to dive deeper in the layers and change our core components to allow our HOCON parser manage multiple files. Let's start with \`SDLBContext\`:

\`\`\`scala
case class SDLBContext private(textContext: TextContext, parentPath: List[String], word: String) extends SDLBLogger:
  export textContext.{isConfigCompleted, rootConfig}

  def withText(newText: String): SDLBContext = copy(textContext = textContext.update(newText))

  def withContents(newContents: Map[String, String]): SDLBContext =
    copy(textContext = textContext.withContents(newContents))

  def withCaretPosition(originalLine: Int, originalCol: Int): SDLBContext =
    val TextContext(_, originalText, _, configText, config, _) = textContext
    // ... as before ...
      

  def getParentContext: Option[ConfigValue] =
    // ... as before ...

object SDLBContext:
  val EMPTY_CONTEXT: SDLBContext = SDLBContext(EMPTY_TEXT_CONTEXT, List(), "")

  def fromText(uri: String, originalText: String, workspaceUriToContents: Map[String, String]): SDLBContext =
    SDLBContext(TextContext.create(uri, originalText, workspaceUriToContents), List(), "")

  def fromText(originalText: String): SDLBContext = fromText("", originalText, Map.empty)

  def isConfigValid(text: String): Boolean = HoconParser.parse(text).isDefined
\`\`\`

The key changes to \`SDLBContext\` are:

![SDLBContext key changes,1. **Multi-file Context**: Added a new method \`withContents\` that allows updating the shared workspace file contents without changing the current text 2. **Extended Factory Method**: Enhanced \`fromText\` to take a URI and a map of all workspace contents, making the context aware of its position in the workspace 3. **Configuration Validation**: Added a utility method \`isConfigValid\` to check if a configuration is parseable, which is crucial for our resilient workspace loading 4. **Exported Properties**: Using Scala 3's \`export\` feature to expose specific properties from the nested \`TextContext\` without breaking encapsulation](\${baseUrl}blog-images/SDLBContextKeyChange.png)



## Refactoring TextContext

Finally let's refactor our last layer, \`TextContext\`:

\`\`\`scala
case class TextContext private (uri: String, originalText: String, workspaceUriToContents: Map[String, String], configText: String, rootConfig: Config, isConfigCompleted: Boolean = true) extends SDLBLogger {

  def withContents(newContents: Map[String, String]): TextContext = copy(workspaceUriToContents=newContents)
  
  def update(newText: String): TextContext = this match
    case EMPTY_TEXT_CONTEXT => TextContext.create(uri, newText, workspaceUriToContents)
    case _ => updateContext(newText)

  private def updateContext(newText: String) =
    val newConfigText = MultiLineTransformer.flattenMultiLines(newText)
    val fullText = (newConfigText::workspaceUriToContents.removed(uri).values.toList).mkString("\\n")
    val newConfigOption = HoconParser.parse(fullText)
    val isConfigCompleted = newConfigOption.isDefined
    val newConfig = newConfigOption.getOrElse(HoconParser.EMPTY_CONFIG)
    if newConfig == HoconParser.EMPTY_CONFIG then
      copy(originalText=newText, isConfigCompleted=isConfigCompleted)
    else
      copy(originalText=newText, configText=newConfigText, rootConfig=newConfig, isConfigCompleted=isConfigCompleted)
}
\`\`\`

The key changes to \`TextContext\` are:

1. **Workspace Awareness**: Added fields for \`uri\` and \`workspaceUriToContents\` to make each context aware of its place in the workspace

2. **Multi-file Parsing**: The crucial change is in \`updateContext\`, where we now merge the current file with all other files in the workspace before parsing. This allows HOCON's natural merging capabilities to work across files.

3. **File Precedence**: We put the current file's content first in the merge list, ensuring it takes precedence in case of conflicts. We also explicitly remove the current URI from the workspace contents to avoid duplication.

4. **Completion Tracking**: Added an \`isConfigCompleted\` flag to track whether the current configuration state can be successfully parsed, which helps with error handling.

## Wiring Everything Together

Last but not least, we need to call the initialization phase from our \`LanguageServer\` implementation:

\`\`\`scala
override def initialize(initializeParams: InitializeParams): CompletableFuture[InitializeResult] = {
    initializeWorkspaces(initializeParams)  
    val initializeResult = InitializeResult(ServerCapabilities())
    initializeResult.getCapabilities.setTextDocumentSync(TextDocumentSyncKind.Full)
    val completionOptions = CompletionOptions()
    completionOptions.setResolveProvider(true)
    initializeResult.getCapabilities.setCompletionProvider(completionOptions)

    initializeResult.getCapabilities.setHoverProvider(true)
    Future(initializeResult).toJava
  }

  private def initializeWorkspaces(initializeParams: InitializeParams): Unit =
    val rootUri = Option(initializeParams).flatMap(_.getWorkspaceFolders
      .toScala
      .headOption
      .map(_.getUri))
      .getOrElse("")
    textDocumentService.initializeWorkspaces(rootUri)
\`\`\`

But wait, how could we call \`initializeWorkspaces\` from a \`TextDocumentService\`? That's right, we can't. This is why we also need to change the definition of this class in our custom Dependency Injection module.

In \`AppModule\`:

\`\`\`scala
  lazy val textDocumentService: TextDocumentService & WorkspaceContext = new SmartDataLakeTextDocumentService(completionEngine, hoverEngine, aiCompletionEngine)
\`\`\`

## Conclusion

In this article, we've successfully implemented multi-file context awareness for our LSP server, a powerful feature that allows it to provide intelligent suggestions based on relationships between different configuration files.

Our implementation highlights several Scala 3 strengths:

![implementation strength,1. **Intersection Types**: Using \`TextDocumentService & WorkspaceContext\` provides a clean way to combine interfaces without complex inheritance hierarchies 2. **Pattern Matching**: Extensive use of pattern matching makes our code both concise and robust 3. **Case Classes and Immutability**: Relying on immutable case classes for our core data structures ensures thread safety and simpler reasoning about state 4. **Strategy Pattern**: Our flexible workspace strategy system allows for easy extension with new grouping algorithms](\${baseUrl}blog-images/lsp08Conclusion.png)

By implementing multi-file awareness, our LSP server can now:

![config improvements,- Suggest data objects defined in other files when completing \`inputIds\` and \`outputIds\` - Validate configurations that span multiple files - Adapt to different project structures through configurable workspace strategies](\${baseUrl}blog-images/lsp08ConfigImprovements.png)

In the next article, we'll look at how to make our workspace strategy and AI prompt configurable through user settings.

Stay tuned for *"Building a Scala 3 LSP Server - Part 9: Making the LSP Server Configurable"*!`;export{e as default};
