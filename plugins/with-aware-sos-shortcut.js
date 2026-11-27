const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');

const SERVICE_NAME = 'com.aware.accessibility.AwareVolumeShortcutService';

module.exports = function withAwareSosShortcut(config) {
  config = withAndroidManifest(config, (modConfig) => {
    const application = modConfig.modResults.manifest.application?.[0];
    if (!application) throw new Error('Android application entry was not generated.');

    application.service = application.service ?? [];
    if (!application.service.some((service) => service.$?.['android:name'] === SERVICE_NAME)) {
      application.service.push({
        $: {
          'android:name': SERVICE_NAME,
          'android:label': 'AWARE SOS volume shortcut',
          'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
          'android:exported': 'true',
        },
        'intent-filter': [
          { action: [{ $: { 'android:name': 'android.accessibilityservice.AccessibilityService' } }] },
        ],
        'meta-data': [
          { $: { 'android:name': 'android.accessibilityservice', 'android:resource': '@xml/aware_volume_shortcut' } },
        ],
      });
    }
    return modConfig;
  });

  return withDangerousMod(config, ['android', async (modConfig) => {
    const projectRoot = modConfig.modRequest.projectRoot;
    const androidRoot = modConfig.modRequest.platformProjectRoot;
    const source = path.join(projectRoot, 'plugins', 'android');
    const javaDir = path.join(androidRoot, 'app', 'src', 'main', 'java', 'com', 'aware', 'accessibility');
    const xmlDir = path.join(androidRoot, 'app', 'src', 'main', 'res', 'xml');
    const valuesDir = path.join(androidRoot, 'app', 'src', 'main', 'res', 'values');
    fs.mkdirSync(javaDir, { recursive: true });
    fs.mkdirSync(xmlDir, { recursive: true });
    fs.mkdirSync(valuesDir, { recursive: true });
    fs.copyFileSync(path.join(source, 'AwareVolumeShortcutService.java'), path.join(javaDir, 'AwareVolumeShortcutService.java'));
    fs.copyFileSync(path.join(source, 'aware_volume_shortcut.xml'), path.join(xmlDir, 'aware_volume_shortcut.xml'));
    fs.copyFileSync(path.join(source, 'aware_shortcut_strings.xml'), path.join(valuesDir, 'aware_shortcut_strings.xml'));
    return modConfig;
  }]);
};
