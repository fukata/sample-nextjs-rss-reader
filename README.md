# sample-nextjs-rss-reader

これは、 [How to Build a Multi-Tenant App with Custom Domains Using Next.js – Vercel Docs](https://vercel.com/guides/nextjs-multi-tenant-application) を参考に作った RSS Reader です。

## 開発方法

### Planet Scaleのデータベース、ブランチを作成（初回のみ）

データベースを作成

```shell
$pscale database create sample-nextjs-rss-reader --region ap-northeast
```

ブランチを作成（dev、shadow）

```shell
$pscale branch create sample-nextjs-rss-reader dev 
$pscale branch create sample-nextjs-rss-reader shadow 
```

### Planet Scaleを起動

２つのターミナルで下記のコマンドを実行します。

ターミナル１

```shell
$pscale connect sample-nextjs-rss-reader dev --port 3309
```

ターミナル２

```shell
$pscale connect sample-nextjs-rss-reader shadow --port 3310
```

### アプリを起動

```shell
yarn dev
```

## Tips

### Prismaのログを見たい時

[Debugging (Reference) - Prisma Docs](https://www.prisma.io/docs/concepts/components/prisma-client/debugging)

```shell
DEBUG="*" yarn dev
```