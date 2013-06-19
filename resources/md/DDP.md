DDP
---------------------

##  DDP定义
　　`DDP`是一个`客户端`和`服务端`之间的`协议`，他支持两种操作：

> - 由`客户端`向`服务端`发起`远程过程调用`
> - `客户端`订阅数据，在他们变化时，`服务器`仍然保持向`客户端`发起通知。

　　本文定义了版本为"`pre1`"的`DDP`，以上仅仅是粗略的描述而非完整明确的定义。

##  一般消息结构
　　无论`SockJS`还是`WebSockets`，`DDP`都将使用较低级别的消息传输方式。（现在，你可以通过`URL`连接`SockJS`的`/sockjs`以及`WebSockets`的`/websocket`。后者很可能将改变为主应用`URL`指定的`WebSocket`子协议）

　　`DDP消息`就是指定了`EJSON`类型字段的`JSON`对象。每个`消息`都有一个`msg`字段来指定消息类型，或根据其他字段确定消息类型。


##  建立DDP连接

> ### **message**分类
>
> 0. `connect` （**client → server**）
>   * `session` : **string**  （尝试连接到现有DDP会话）
>   * `version` : **string**  （拟定的协议版本）
>   * `support` : **[string]**  （客户端支持的协议版本，按优先顺序排列）
> 0. `connected` （**server → client**）
>   * `session` : **string**  （DDP会话标识）
> 0. `failed`  （**server → client**）
>   * `version` : **string**  （建议连接协议版本）
>
> ### 步骤
>
> 　　`服务器`可能会发送一个缺失键名为`msg`的初始化`message`，如果是这样的，`客户端`会忽略它，也不会等待此`message`。（此`message`是通过`SockJS`传输帮助实现`代码热部署`的，可能不应该，但目前我们是通过`WebSocket`实现的）
>
> - `客户端`发送`connect`消息。
> - 如果`服务器`允许通信的消息的`version`与接收到的`connect`消息匹配，`服务器`会发送`connected`消息。
> - 否则`服务器`会关闭底层传输，发送`failed`消息，告之允许通信的DDP版本以及`connect`消息中的`support`字段。
> - `客户端`建新`connect`消息尝试使用不同版本的DDP连接。`客户端`会发送众多的`connect`消息，直到连接匹配。如果`服务器`还不支持，就会忽略掉这些附加信息。

　　`connect`消息的`support`字段存储的版本信息是根据客户端的喜好优先级排列的。如果按照这个顺序，由客户端提出的`version`不是服务器支持的，服务器必会发送`failed`消息，强制客户端切换到更好的版本。

　　当客户端第一次连接到服务器，他会设置`version`为自己最认可的版本。如果有需要，客户端可以记住最终能与服务端匹配的版本。如果服务端能拥有更好的版本或者客户端已经升级，客户端始终依靠服务端发来的`failed`消息。

##  管理数据

> ### **message**分类
>
> 0. `sub` （**client → server**）
>   * `id` : **string**  （订阅的标识符）
>   * `name` : **string**  （订阅的名字）
>   * `params` : *[EJSON]*  （可选的订阅参数）
> 0. `unsub` （**client → server**）
>   * `id` : **string**  （`sub`消息中的id）
> 0. `nosub`  （**server → client**）
>   * `id` : **string**  （`sub`消息中的id）
> 0. `error` : *Error*（可选的错误，订阅错误总结或者订阅不存在等） 
> 0. `added` （**server → client**）
>   * `collection` : **string**  （`Collecction`名字）
>   * `id` : **string**  （`Document`id）
>   * `fields` : *EJSON*  （可选的`EJSON`值）
> 0. `changed` （**server → client**）
>   * `collection` : **string**  （`Collecction`名字）
>   * `id` : **string**  （`Document`id）
>   * `fields` : *EJSON*  （可选的`EJSON`值）
>   * `cleared` : *[string]*  （可选的，要删除的字段名）
> 0. `removed` （**server → client**）
>   * `collection` : **string**  （`Collecction`名字）
>   * `id` : **string**  （`Document`id）
> 0. `ready` （**server → client**）
>   * `subs` : **[string]**  （所有通过`sub`传递的id集）
> 0. `addedBefore` （**server → client**）
>   * `collection` : **string**  （`Collecction`名字）
>   * `id` : **string**  （`Document`id）
>   * `fields` : *EJSON*  （可选的`EJSON`值）
>   * `before` : **string/null**  （`Document`添加前的id，或者null表示添加完毕）
> 0. `movedBefore` （**server → client**）
>   * `collection` : **string**  （`Collecction`名字）
>   * `id` : **string**  （`Document`id）
>   * `before` : **string/null**  （`Document`删除前的id，或者null表示删除完毕）

> ### 步骤
> - `客户端`指定感兴趣的信息集，发送`sub`消息给`服务器`。
> - 在任何时间里，`sub`消息都会被通知到，`服务器`再发送数据到客户端。数据包含了`added`、`changed`、`removed`消息。这些消息的本地数据模型将会被跟踪。
>   * `added`消息表示了本地数据集的一个`Document`。`id`字段将被指定为`Document`的`id`，其他字段将被指定为`Document`的其他字段。`minimongo`通过特殊的方式将`id`转化为`_id`以存储到`Mongo`的文档集中。
>   * `changed`消息表示了本地数据集的一个`Document`有了新的字段值或某些字段被删除了。`id`字段指定了被改变了的`Document`的`id`，`fields`如果存在，表示文档中哪些字段值应该被替换。需要清除的字段应该放在`cleared`中以数组的形式呈现。
>   * `removed`消息表示了本地数据集的一个`Document`需要删除了。`id`字段指定了需要删除的`Document`的`id`。
> - 如果一个`Collection`被订购过，`addedBefore`消息可以取代`added`消息。包含有该`id`的`Document`在被添加后可插入`before`字段。如果`before`字段设置为`null`,`Document`将被添加，直到结束。对于一个给定的集合，`服务器`只应发送`added`或`addedBefore`消息，而不是两者混合起来发。并且只能发送`movedBefore`消息给使用`addedBefore`消息的`Collection`。
>
>　**注意 ：**
> 被订购过的`Collection`的`DDP`消息没有使用在`Meteor`中，不过今后将会使用。
>
> - `客户端`保持每一个`Collection`的数据。每个订阅不会做自己的数据集，但重复订阅会导致`服务器`发送关于`Collection`数据的字段联盟。例如，订阅器A说文档x有字段`{foo:1,bar:2}`,订阅器B说文档x有`{foo:1,baz:3}`，此时`客户端`将通知文档x拥有字段`{foo:1,bar:2,baz:3}`。如果字段值因为不同订阅器发生冲突，`服务器`会发送一个可用的字段值。
> - 当一个或多个订阅完成首批数据的发送，服务器将发送`ready`消息并伴随他们的`id`信息。

##  远程过程调用

> ### **message**分类
>
> 0. `method` （**client → server**）
>   * `method` : **string**  （方法名）
>   * `params` : *[EJSON]*  （可选的方法参数）
>   * `id` : **string**  （方法调用的客户端标识）
> 0. `result` （**server → client**）
>   * `id` : **string**  （`method`消息中的`id`）
>   * `error` : *Error*  （可选的，方法调用时的错误或者方法不存在）
>   * `result` : *EJSON*  （可选的，方法的返回值）
> 0. `updated`  （**server → client**）
>   * `methods` : **string**  （所有调用过`method`消息的`id`）

> ### 步骤
> - `客户端`发送一个`method`消息到`服务器`
> - `服务端`响应一个`result`消息到`客户端`，带有方法调用的返回值或者错误信息。
> - 如果`客户端`接受过订阅，方法调用将直接影响数据。一旦`服务端`基于此方式完成所有相应数据的发送，`服务器`会发送一个`updated`消息给`客户端`，并带有所有方法的id集。

##  错误
　　`result`和`nosub`消息中会出现一个可选的`error`字段，一个错误消息具备如下字段：

- error  :  **number**  （错误号）
- reason  : *string*  （可选的错误原因）
- details : *string*  （可选的错误详情）

　　`error`用来呈现订阅或者远程调用方法时出现的错误信息，订阅不存在或者调用方法不存在时，也通过这个传递信息。

　　客户端也能发送其他的错误消息给服务端，这样的消息将以`error`为最顶级直接呈现，并包含以下信息：

- 不合法的JSON对象信息
- 未知的`msg`类型
- 其他畸形客户端请求（不包括所需字段）
- 发送第一次`connect`消息或者`connect`消息初始化无关的其他内容

　　这样的`error`消息将包含以下字段

- reason  : **string**  （描述错误的字符串）
- offendingMessage  : **  （包含原来解析正确的消息）

##  使用

　　做了两个例子，可以参照[这篇文章][Meteor-DDP-Example]做一下。

##  附录

　　`EJSON`是一种嵌入扩展`JSON`的`JSON`对象。他支持所有平时所见的`JSON`类型，同时附加了如下内容：

### Dates

    {"$date": MILLISECONDS_SINCE_EPOCH}

### Binary data:

    {"$binary": BASE_64_STRING}

　　基于64位字符串，有符号`+`和`/`，没有长度限制。

　　**转义内容**，否则看上去更像是`EJSON`类型：

    {"$escape": THING}

　　例如，把`JSON`值`{$date:10000}`装进`EJSON`对象中：

    {"$escape": {"$date": 10000}}

　　**注意：**

　　转义内容的键必须存放在下级，你也可以再嵌套`EJSON`，例如，下面将`$date`映射到一个日期对象上：

    {"$escape": {"$date": {"$date": 32491}}}

### User-specified types

    {"$type": TYPENAME, "$value": VALUE}

　　实现`EJSON`应尽量保证键位顺序。如果允许，也可以不必这样。

> `MongoDB`依赖键位顺序。在`MongoDB`中使用`EJSON`是，实现的`EJSON`必须保持键位顺序。


　　有关`EJSON`的详细信息可以到`Meteor`的[文档中心-EJSON][Meteor-Docs-EJSON]查阅，或是查看讲解[EJSON的视频][Meteor-What-is-EJSON]。


[Meteor-Docs-EJSON]:http://docs.meteor.com/#ejson
[Meteor-DDP-Example]:Meteor-DDP.md
[Meteor-What-is-EJSON]:http://www.eventedmind.com/posts/meteor-what-is-ejson