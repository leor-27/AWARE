package com.aware.accessibility;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.view.KeyEvent;

public class AwareVolumeShortcutService extends AccessibilityService {
  private static final long HOLD_DURATION_MS = 3000L;
  private final Handler handler = new Handler(Looper.getMainLooper());
  private boolean volumeUpDown;
  private boolean volumeDownDown;
  private boolean chordStarted;
  private boolean chordTriggered;

  private final Runnable triggerShortcut = () -> {
    if (!volumeUpDown || !volumeDownDown || chordTriggered) return;
    chordTriggered = true;
    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("aware://shortcut-sos"));
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    try {
      startActivity(intent);
    } catch (RuntimeException ignored) {
      // The app may be unavailable; do not interrupt the system volume controls.
    }
  };

  @Override
  protected void onServiceConnected() {
    AccessibilityServiceInfo info = getServiceInfo();
    if (info != null) {
      info.flags |= AccessibilityServiceInfo.FLAG_REQUEST_FILTER_KEY_EVENTS;
      setServiceInfo(info);
    }
  }

  @Override
  protected boolean onKeyEvent(KeyEvent event) {
    int keyCode = event.getKeyCode();
    if (keyCode != KeyEvent.KEYCODE_VOLUME_UP && keyCode != KeyEvent.KEYCODE_VOLUME_DOWN) {
      return false;
    }

    if (event.getAction() == KeyEvent.ACTION_DOWN) {
      if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) volumeUpDown = true;
      if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) volumeDownDown = true;
      if (volumeUpDown && volumeDownDown && !chordStarted) {
        chordStarted = true;
        handler.postDelayed(triggerShortcut, HOLD_DURATION_MS);
      }
      return volumeUpDown && volumeDownDown;
    }

    boolean wasChord = volumeUpDown && volumeDownDown;
    if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) volumeUpDown = false;
    if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) volumeDownDown = false;
    if (!volumeUpDown || !volumeDownDown) {
      handler.removeCallbacks(triggerShortcut);
      chordStarted = false;
      chordTriggered = false;
    }
    return wasChord;
  }

  @Override
  public void onAccessibilityEvent(android.view.accessibility.AccessibilityEvent event) {
    // AWARE only observes hardware key events; it does not inspect screen content.
  }

  @Override
  public void onInterrupt() {
    handler.removeCallbacks(triggerShortcut);
    volumeUpDown = false;
    volumeDownDown = false;
    chordStarted = false;
    chordTriggered = false;
  }
}
