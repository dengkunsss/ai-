/*
 * ModFGO-lite (frida-gadget / zygisk)
 * 游戏: com.aniplex.fategrandorder (JP/EN), com.bilibili.fatego (CN)
 *
 * 修改 hook 后只需重启游戏生效(on_change=reload 对运行中进程热重载),
 * 不需要重新编译面具模块。
 *
 * 地址来源: github.com/chaldea-center/fgo-pseudo 的 00_dump.cs
 * 注意: 游戏大更新后 RVA 可能变化, 以最新 dump.cs 为准!
 */
'use strict';

/* ================= 配置区 ================= */
const CFG = {
    SPEED_X2: true,   // 战斗速度 x2 (2倍档变4倍, 1倍档变2倍)
};
/* ========================================== */

const IL2CPP = 'libil2cpp.so';
const RVA = {
    // BattlePerformance.setBattleSpeed(float time)
    setBattleSpeed: 0x31f68ac,
};
/* ========================================== */

let il2cppBase = null;

// gadget 里 console.log 可能进不了 logcat, 统一走 android.util.Log
function log(msg) {
    try {
        Java.perform(function () {
            Java.use('android.util.Log').i('modfgo', String(msg));
        });
    } catch (e) {
        try { console.log(msg); } catch (_) {}
    }
}

function getBase() {
    if (il2cppBase === null) {
        const m = Process.findModuleByName(IL2CPP);
        if (m === null) throw new Error('libil2cpp.so not loaded');
        il2cppBase = m.base;
        log('libil2cpp base = ' + il2cppBase);
    }
    return il2cppBase;
}

function hook(rva, name, onEnter) {
    const addr = getBase().add(rva);
    try {
        addr.readU8(); // 地址可读性检查
        Interceptor.attach(addr, { onEnter: onEnter });
        log('hook ok: ' + name + ' @ ' + addr);
        return true;
    } catch (e) {
        log('hook FAIL: ' + name + ' (' + e + ') —— RVA 与游戏版本不匹配?');
        return false;
    }
}

function install() {
    log('installing hooks, CFG=' + JSON.stringify(CFG));

    if (CFG.SPEED_X2) {
        hook(RVA.setBattleSpeed, 'setBattleSpeed', function (args) {
            const t = args[0].toFloat();
            if (t > 0) {
                args[0].replace(t * 2.0);
                log('setBattleSpeed ' + t + ' -> ' + (t * 2.0));
            }
        });
    }
}

const timer = setInterval(function () {
    if (Process.findModuleByName(IL2CPP) !== null) {
        clearInterval(timer);
        try { install(); } catch (e) { log('install error: ' + e); }
    }
}, 500);
