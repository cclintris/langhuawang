# Express+mysql+前端 完整實現 登陸+註冊

## Express 服務器準備工作
我們要先用 Express 建立一個服務器。
1. 首先，cmd 進入項目的目錄下
2. 執行命令 `express demo`，這邊 demo 項目名可自定義
3. cd 進入 demo
4. 執行命令 `npm i` 安裝依賴模塊
5. 執行命令 `npm i mysql` 安裝 mysql 模塊

服務器的項目結構應如下:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-1.png)
檢查下 package.json 確認 mysql 模塊成功安裝，應如下圖:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-2.png)

接著，我們要在 public 文件夾下添加一個 htmls 文件夾，存放所有的 html 文件。還要添加一個 mysql 文件夾，存放一個給別人用於導入數據庫的 .sql 文件。此時，項目結構應如下:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-3.png)

我們知道，至少要有一個登陸頁面，一個註冊頁面，以及一個主頁。在註冊頁面和登陸頁面中，我使用 `form` 標籤，提交時會向我們的服務器發送請求。因此，要在服務器中接收該請求，處理後返回。

在 routes 文件夾中我添加了一個 login_register.js 來連接 mysql 以及所有登錄註冊的業務邏輯。來看看現在的項目結構:
(這邊因為我是在我自己的基礎網站上增加登陸註冊功能的，所以可以忽略 curry-pic.html, curry-pic.css, klay-pic.html, klay-pic.css, highlights.html, highlights.css)
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-4.png)
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-5.png)

在真正進入實際登陸註冊的業務邏輯之前，還差最後一步。我們要修改一下 app.js。

app.js 代碼修改位置
- 向 app.js 註冊 login_register 路由，並註冊為根路由:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-7.png)
- 啟用監聽端口，盡量避免一些常用端口(80, 22, 等等)。這裡我用了 30010 端口:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-8.png)

至此，關於我們 Express 服務器的準備工作結束。接下來，探討關於註冊以及登陸的業務邏輯，以及連接 mysql 的方式。

## mysql 部分
我們首先關注，Express 作為一個服務器如何連接 mysql。具體代碼位置在 /routes/login_register.js 中，如下:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-9.jpg)
這邊要更改你自己電腦上 mysql 的用戶名和密碼，且要先建立一個數據庫，這邊我的是 login_register。

當然，有了數據庫，要有 sql 文件供使用者導入數據，在這邊就不再多多說，非常簡單的!這邊簡單附上我自己的 sql 文件僅供參考:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-10.png)

當然，建立了服務器與數據庫的連接後，我們就要來關心如何做到查詢的動作。但鑑於非該篇重點，不在這邊做太多討論。

## 加密 vs 解密
說到加密，相信大家都不陌生，在很多場合都需要加密解密。而對於網站的註冊登陸，無非就是要對用戶的密碼進行保護。

這邊我的做法是，在前端和後端都做加密的動作，也就是經過了兩層加密。具體做法如下:

在註冊以及登陸的頁面中，我都用了 html 的 form 標籤。然後，在發往服務器之前，為了防止惡意攻擊 http 請求，我這邊就先進行了一次加密，使用的是 ==md5== 算法。這是第一次加密(前端)。

第二次加密，是在服務端進行的加密。當服務器收到由前端 md5 加密過的用戶密碼後，我再進行第二次加密，使用的是加鹽哈希的加密方式，算法用的是 Node.js 提供的 crypto 庫所提供的 ==sha512== 算法。

那對於用戶登入，當然我們就再處理解密。解密的過程其實就是加密的相反，只要將用戶輸入的密碼，與數據庫中存儲的信息進行一次反向的加密操作，再進行驗證，就可以完成登錄的密碼核對。

這部分代碼都在 /routes/login_register.js 中，這邊只展示加密和解密的關鍵代碼:

- 加密

==前端加密:==

在 login.html/register.html 中引入:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-14.png)

在 login.js中:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-16.png)

在 register.js中:
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-15.png)


==後端加密:==
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-11.png)
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-12.png)

- 解密
![](https://wtfhhh.oss-cn-beijing.aliyuncs.com/lr-13.png)

