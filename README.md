# ModFGO-lite

原版 ModFGO(hexstr) 已随 FGO 升级 Unity 6 失效。本项目用"zygisk 注入 frida-gadget + JS hook"的方式重建,
**功能写在 `files/modfgo.js` 里, 改完重启游戏即生效, 不用重新编译**。

## 构建(无需本地环境)

1. 把本仓库 push 到你的 GitHub(网页新建仓库后, 上传本目录全部文件)。
2. Actions 页签 → 左侧 "build" → Run workflow。
3. 约 5 分钟后, 在该次运行的 Artifacts 里下载 `zygisk_ModFGO-lite.zip`。
4. Magisk 刷入该 zip, **重启手机**, 进游戏。

## 排障

```sh
adb logcat -s ModFGO-lite:* modfgo:*
```

- `gadget loaded` = 注入成功; `dlopen failed` = customize.sh 没生效, 重装模块。
- `hook FAIL: setBattleSpeed` = 游戏版本与 RVA 不匹配, 去
  [chaldea-center/fgo-pseudo](https://github.com/chaldea-center/fgo-pseudo) 取最新 00_dump.cs 更新 `files/modfgo.js` 里的 RVA。

## 免责

仅供学习研究。使用修改器有封号风险, 后果自负。
