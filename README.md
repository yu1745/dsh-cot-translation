# Reasoning translation with a selectable model

A fork of DeepSeek Harness’s MIT-licensed reasoning translation. It preserves on-expand translation, original text, retry, and session caching. The default is Bing. Google, eligible native DeepSeek services, and text models configured in DSH are also supported. This release targets DSH `0.2.2-rc.3`.

1. Install the plugin from yu1745 DSH Plugins in the Discover tab. If the official bundle is enabled, disable it first because the two bundles share a translation service and reasoning slot.
2. Configure your API and a text model in DSH’s model settings.
3. In this plugin’s settings, choose **Configured model**, select the model and target language, and save. Use `auto` to follow the interface language.
4. Expand a reasoning block to translate it. **View original** switches back.

The selected service receives only the fragments being translated. These fragments may contain code or conversation details. Provider charges and data policies apply.

[中文](README.zh.md)
