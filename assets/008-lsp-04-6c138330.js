const e=`---
id: 8
title: "Building a Scala 3 LSP Server - Part 4"
description: "Parsing with Purpose: Building a Resilient Context-Aware HOCON Processor for LSP"
publishedDate: 2025-04-21
image: lsp03.png
keywords:
  - Scala 3
  - LSP
  - LSP4J
  - IDE
  - Resilient Parsing
---

Welcome to the fourth part of this LSP series. After presenting the general architecture of the LSP server in Part 1, building up the core components along with the logging management system in Part 2, designed a wrapper around the HOCON parser, we'll dive deeper into implementing a \`SchemaReader\`, taking a JSON Schema and providing a list of valid object definitions given a context path.

📦 [**View the source code on GitHub**](https://github.com/smart-data-lake/sdl-lsp) – Explore the complete implementation. Leave a star if you like it!

To start, we need first to understand the definition of our, language Smart Data Lake Builder.
Luckily the SDLB team already implemented a Json Schema definition of the language.
It looks like this:

\`\`\`json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "version": "2.5.0",
  "id": "sdl-schema-2.5.0.json#",
  "definitions": {
    "ExecutionMode": {
      "CustomMode": {
        "type": "object",
        "properties": {
          "type": {
            "const": "CustomMode"
          },
          "className": {
            "type": "string",
            "description": "class name implementing trait[[CustomModeLogic]]"
          },
          "alternativeOutputId": {
            "type": "string",
            "description": "optional alternative outputId of DataObject later in the DAG. This replaces the mainOutputId.\\nIt can be used to ensure processing over multiple actions in case of errors."
          },
          "options": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            },
            "description": "Options specified in the configuration for this execution mode"
          }
        },
        "title": "CustomMode",
        "required": [
          "type",
          "className"
        ],
        "additionalProperties": false,
        "description": "Execution mode to create custom execution mode logic.\\nDefine a function which receives main input&output DataObject and returns execution mode result"
      },
      "CustomPartitionMode": {
        "type": "object",
        "properties": {
          "type": {
            "const": "CustomPartitionMode"
          },
          "className": {
            "type": "string",
            "description": "class name implementing trait[[CustomPartitionModeLogic]]"
          },
          "alternativeOutputId": {
            "type": "string",
            "description": "optional alternative outputId of DataObject later in the DAG. This replaces the mainOutputId.\\nIt can be used to ensure processing all partitions over multiple actions in case of errors."
          },
          "options": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            },
            "description": "Options specified in the configuration for this execution mode"
          }
        },
        "title": "CustomPartitionMode",
        "required": [
          "type",
          "className"
        ],
        "additionalProperties": false,
        "description": "Execution mode to create custom partition execution mode logic.\\n\\nDefine a function which receives main input&output DataObject and returns partition values to process as\`Seq[Map[String,String]]\`"
      },
      (...)
\`\`\`

There are three main interesting things to outline here:

- Given an object name, we have a list of possible definitions
- For a given definition, we have a list of attributes: optional, required or imposed (constant).
- Each attribute provides a \`description\` that will be very valuable for the hover capability.


Second step is to look for Json-parsing libraries. My choice went to \`ujson\` from Lihaoyi, because of its simplicity and lightweight implementation, making it very flexible and performant. Let's add it to our maven build:

\`\`\`xml
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <encoding>UTF-8</encoding>
    <scala.version>3.3.4</scala.version>
    <lsp4j.version>0.21.0</lsp4j.version>
    <typesafe.config.version>1.4.3</typesafe.config.version>
    <ujson.version>3.1.2</ujson.version> <!-- Add this line -->
    <logback.version>1.4.12</logback.version>
  </properties>

(...)

<!-- Add this block dependency -->
<dependency>
  <groupId>com.lihaoyi</groupId>
  <artifactId>ujson_3</artifactId>
  <version>\${ujson.version}</version>
</dependency>
\`\`\`

Now let's start implementing our Schema Reader. First thing to realize is that definitions in the Json Schema are defined in a modular way to avoid repetition. For example \`ExecutionMode\` can be found in the \`transformers\` of \`CopyAction\` but also in the \`transformers\` of \`CustomDataFrameAction\`. It means that we need both a pointer to the local schema, i.e. the one following the HOCON path (eg \`actions.join-departures-airports.transformers.1.description\` as discussed in part 3) but we should keep a pointer to the global schema, i.e. the root of the Json Schema, to be able to look for definitions from the start if the definition is defined somewhere else.

Let's then define a case class representing both pointers:

\`\`\`scala
private[schema] case class SchemaContext(private val globalSchema: Value, localSchema: Value)
\`\`\`

Then we can define a global schema context the following way:

\`\`\`scala
class SchemaReaderImpl(val schemaPath: String) extends SchemaReader with SDLBLogger:

  private val schema = ujson.read(Using.resource(getClass.getClassLoader.getResourceAsStream(schemaPath)) { inputStream =>
    Source.fromInputStream(inputStream).getLines().mkString("\\n").trim
  })


  private[schema] def createGlobalSchemaContext: SchemaContext = SchemaContext(schema, schema)
\`\`\`

Here we define the \`createGlobalSchemaContext\` private to its package level. That's become handy when we need to reuse it for our tests. Also, we start the search with both pointers to the global schema level.

Let's remember that our goal is to be able to retrieve possible items given the HOCON context path for our code completion feature. Also, we would like to retrieve the description of each items for our hovering feature. Let's start by defining the base case classes of what our service will give back:

\`\`\`scala
enum ItemType(val name: String, val defaultValue: String):
  // $0 represents the position of the cursor in the snippet
  case STRING extends ItemType("string", "\\"$0\\"")
  case BOOLEAN extends ItemType("boolean", "true$0")
  case INTEGER extends ItemType("integer", "0$0")
  case OBJECT extends ItemType("object", "{$0}")
  case ARRAY extends ItemType("array", "[$0]")
  case TYPE_VALUE extends ItemType("type", "$0")
  
  def isPrimitiveValue: Boolean = this == ItemType.STRING || this == ItemType.BOOLEAN || this == ItemType.INTEGER
  
  def isComplexValue: Boolean = this == ItemType.OBJECT || this == ItemType.ARRAY

object ItemType extends SDLBLogger:
  private val logger = LoggerFactory.getLogger(getClass)
  def fromName(name: String): ItemType = name match
    case "string" => ItemType.STRING
    case "boolean" => ItemType.BOOLEAN
    case "integer" => ItemType.INTEGER
    case "object" => ItemType.OBJECT
    case "array" => ItemType.ARRAY
    case _ => 
      warn(s"Attempt to translate unknown type: $name")
      ItemType.STRING
\`\`\`

An item type is defined by the name of the type as well as a default value that will both become handy for our code completion capability. Notice the \`$0\`, a special syntax defined in the LSP protocol to suggest the client where to position the caret at the end of the code completion insertion. Also, we defined a companion object for the enum to map the string representation of a type to its \`ItemType\`, which will be useful when parsing the Json schema. Now, let's define the schema item properties:

\`\`\`scala
case class SchemaItem(name: String, itemType: ItemType, description: String, required: Boolean)
\`\`\`

We can see that what is of interest for us are:

- \`name\`: the name of the item. That will be mainly used as the label of the completion item visible to the user. Also, it permits us to build custom code around some special values of SDLB, like \`actions\` or \`dataObjects\`
- \`itemType\`: the type of the item, as defined above
- \`description\`: The description of the item, useful for hovering capabilities
- \`required\`: a boolean that will let us know the user if the item is required. It can be an object such as \`actions\` or a specific attribute of any objects.

![Screenshot of schema item](\${baseUrl}blog-images/schemaItemExample.png)

Also, for our LSP to be really powerful, we don't just want to generate attribute suggestions. We can also leverage the fact that if it starts writing the name of, let say, a specific action, then we could generate the whole object definition with required attributes, as shown in the screenshot below:

![Screenshot of a template getting generated](\${baseUrl}blog-images/lsp-generating-template.png)

![Screenshot of a template getting generated](\${baseUrl}blog-images/lsp-template-generated.png)

Here we actually used AI enhanced code completion to give default values meaningful defaults, but more on that on a later post. But what actually matters here is to see that we can leverage the use of required fields and suggest a text much more powerful than just the name \`CustomDataframeAction\`.

For us to be able to generate such item suggestions, we also need a last important information to transmit:

\`\`\`scala
enum TemplateType:
  case 
    OBJECT, // Object is recognized, attributes are suggested
    ARRAY_ELEMENT, // Array is recognized, elements are suggested (can be string, object, etc.)
    ATTRIBUTES // Anonymous object, possible object definitions are suggested. See "executionMode" of "CustomDataFrameAction" for example
\`\`\`

There are three types of templates we can generate with SDLB:

- \`OBJECT\`, the most common case
![GIF example of basic code completion](\${baseUrl}blog-images/simpleCodeCompletion.gif)
- \`ARRAY_ELEMENT\`, like a specific \`transformer\` in a \`transformers\` list
![GIF example of array element code completion](\${baseUrl}blog-images/lspArrayTemplate.gif)
- \`ATTRIBUTES\`, this one is more tricky. As we saw in previous posts, objects in a list like in \`transformers\` behave as anonymous object, because an array is a list of values directly, without any reference to a key. We could say that their key is the index of the object, as we chose to encode in our HOCON context path. But there is one remaining possible anonymous object, such as \`executionMode\` of \`CustomDataFrameAction\`. This one, \`executionMode\` acts as the key itself but the definition could be a list of different objects, with each having their own set of attributes. So what we can do is generating this list given the type of object \`executionMode\` will take.
![GIF example of anonymous object](\${baseUrl}blog-images/lspAnonymousObject.gif)

We can wrap up our data definition with these last case classes:

\`\`\`scala
object SchemaCollections:
  case class AttributeCollection(attributes: Iterable[SchemaItem])
  case class TemplateCollection(templates: Iterable[(String, Iterable[SchemaItem])], templateType: TemplateType)
\`\`\`

Notice here we took the choice to deliberately not defining a common trait for both objects. This way, we can define our \`SchemaReader\` the following way:

\`\`\`scala
trait SchemaReader:
  def retrieveAttributeOrTemplateCollection(context: SDLBContext): AttributeCollection | TemplateCollection
  def retrieveDescription(context: SDLBContext): String
\`\`\`

Here we leverage the \`Union\` type in Scala 3 for the code completion feature. But why? The thing is that we will only be able to know what is the nature of the completion once we found it. So it is difficult to suggest a method to the user of this class and letting them call the right method in a two-phase procedure as we may usually do. We could define a common trait for both part, but because we only have two choices, avoiding this abstraction layer is actually faster to understand how to handle the return object when calling \`retrieveAttributeOrTemplateCollection\`. The \`Union\` type forces the user to use a pattern matching to handle both cases, and implementation-wise, we only run the schema search once.

TODO dive concretly into how to traverse the Json schema given the context.`;export{e as default};
