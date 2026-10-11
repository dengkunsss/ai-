#!/system/bin/sh
# 安装时(root)把 gadget 和脚本复制进游戏数据目录, 并归属给应用 uid
PKGS="com.aniplex.fategrandorder com.aniplex.fategrandorder.en com.bilibili.fatego"

for pkg in $PKGS; do
    uid=$(stat -c "%u" "/data/data/$pkg" 2>/dev/null)
    [ -z "$uid" ] && continue
    dst="/data/data/$pkg/files/modfgo"
    mkdir -p "$dst"
    cp "$MODPATH/files/libmfgo.so"        "$dst/libmfgo.so"
    cp "$MODPATH/files/libmfgo.config.so" "$dst/libmfgo.config.so"
    cp "$MODPATH/files/modfgo.js"         "$dst/modfgo.js"
    chmod 755 "$dst/libmfgo.so"
    chmod 644 "$dst/libmfgo.config.so" "$dst/modfgo.js"
    chown -R "$uid:$uid" "$dst"
    ui_print "- injected files -> $dst (uid=$uid)"
done
