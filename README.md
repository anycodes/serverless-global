# Components全局变量配置

在使用Serverless Framework Components的时候，会遇到配置一些全局变量，例如我有多个函数，需要配置数据库等信息，但是在Serverless Framework Components中貌似并不能支持全局变量，所以做了这个非常简单的组件来实现。

使用防范很简单，在Yaml中增加全局配置的字段：

```yaml
Conf:
  component: "serverless-global"
  inputs:
    mysql_host: gz-cdb-mytest.sql.tencentcdb.com
    mysql_user: mytest
    mysql_password: mytest
    mysql_port: 62580
    mysql_db: mytest
    mini_program_app_id: mytest
    mini_program_app_secret: mytest
    tst:  ${file(./serverless_1.yaml)}
```

然后在项目部署的时候可以直接放到对应的组件内，例如：`${Conf.mysql_host}`

如果需要引用其他yaml，可以使用上面的`tst:  ${file(./serverless_1.yaml)}`写法，其他程序引用只需要：
`mysql_host: ${Conf.tst.mysql_hosta}`即可

整体Yaml可以这样：

```yaml
Conf:
  component: "serverless-global"
  inputs:
    mysql_host: gz-cdb-mytest.sql.tencentcdb.com
    mysql_user: mytest
    mysql_password: mytest
    mysql_port: 62580
    mysql_db: mytest
    mini_program_app_id: mytest
    mini_program_app_secret: mytest


Album_Login:
  component: "@serverless/tencent-scf"
  inputs:
    name: Album_Login
    codeUri: ./album/login
    handler: index.main_handler
    runtime: Python3.6
    region: ap-shanghai
    environment:
      variables:
        mysql_host: ${Conf.mysql_host}
        mysql_port: ${Conf.mysql_port}
        mysql_user: ${Conf.mysql_user}
        mysql_password: ${Conf.mysql_password}
        mysql_db: ${Conf.mysql_db}
```

这样就可以设置全局变量了。
