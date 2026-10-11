// ModFGO-lite zygisk injector
// 只负责在游戏进程里 dlopen frida-gadget(libmfgo.so), hook 逻辑全在 modfgo.js
#include <android/log.h>
#include <android/dlext.h>
#include <dlfcn.h>
#include <stdio.h>
#include <string.h>
#include "zygisk.hpp"

#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, "ModFGO-lite", __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, "ModFGO-lite", __VA_ARGS__)

// 前缀匹配: "com.aniplex.fategrandorder" 同时覆盖日服和国际服(.en)
static const char *kPkgs[] = {
    "com.aniplex.fategrandorder",
    "com.bilibili.fatego",   // 国服
};

class ModFGOLite : public zygisk::ModuleBase {
public:
    void onLoad(zygisk::Api *api, JNIEnv *env) override {
        api_ = api;
        env_ = env;
    }

    void postAppSpecialize(const zygisk::AppSpecializeArgs *args) override {
        if (!args || !args->nice_name) return;
        const char *name = env_->GetStringUTFChars(args->nice_name, nullptr);
        if (!name) return;
        for (const char *pkg : kPkgs) {
            if (strstr(name, pkg)) {
                char path[256];
                snprintf(path, sizeof(path),
                         "/data/data/%s/files/modfgo/libmfgo.so", pkg);

                // 简化版：直接使用 android_dlopen_ext，不主动指定 namespace
                android_dlextinfo extinfo = {};
                extinfo.flags = 0; 

                void *h = android_dlopen_ext(path, RTLD_NOW | RTLD_GLOBAL, &extinfo);
                if (h) LOGI("gadget loaded: %s", path);
                else     LOGE("dlopen failed: %s (%s)", path, dlerror());
                break;
            }
        }
        env_->ReleaseStringUTFChars(args->nice_name, name);
    }

private:
    zygisk::Api *api_ = nullptr;
    JNIEnv *env_ = nullptr;
};

REGISTER_ZYGISK_MODULE(ModFGOLite);
