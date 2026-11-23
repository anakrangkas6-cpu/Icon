export interface AndroidXmlBundle {
  appfilterXml: string;
  drawableXml: string;
  iconpackXml: string;
}

export function getGitHubWorkflowYaml(): string {
  return `name: Build Sunlit OneUI Icon Pack APK

on:
  push:
  pull_request:
  workflow_dispatch:

jobs:
  build-apk:
    name: Build & Sign Android Icon Pack APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Detect Android project directory
        run: |
          if [ -f "android-iconpack/build.gradle.kts" ]; then
            echo "PROJECT_DIR=android-iconpack" >> "$GITHUB_ENV"
          else
            echo "PROJECT_DIR=." >> "$GITHUB_ENV"
          fi

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'

      - name: Accept Android SDK licenses & ensure SDK 34
        run: |
          SDK_ROOT="\${ANDROID_HOME:-\${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
          echo "ANDROID_HOME=\$SDK_ROOT" >> "$GITHUB_ENV"
          SDK_MGR=\$(find "\$SDK_ROOT" -name "sdkmanager" 2>/dev/null | head -n 1)
          if [ -n "\$SDK_MGR" ]; then
            yes | "\$SDK_MGR" --licenses >/dev/null 2>&1 || true
            "\$SDK_MGR" "platforms;android-34" "build-tools;34.0.0" >/dev/null
          fi

      - name: Set up Gradle 8.7
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.7'

      - name: Build & Sign Debug + Release APKs
        run: |
          cd "\$PROJECT_DIR"
          if [ -n "\${{ secrets.KEYSTORE_BASE64 }}" ]; then
            echo "\${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > release.keystore
            KS_PASS="\${{ secrets.KEYSTORE_PASSWORD }}"
            KEY_ALIAS="\${{ secrets.KEY_ALIAS }}"
            KEY_PASS="\${{ secrets.KEY_PASSWORD }}"
          else
            keytool -genkeypair -noprompt -keystore release.keystore -alias sunlit -keyalg RSA -keysize 2048 -validity 10000 -storepass sunlit123 -keypass sunlit123 -dname "CN=Sunlit OneUI, O=IconPack, C=ID"
            KS_PASS="sunlit123"
            KEY_ALIAS="sunlit"
            KEY_PASS="sunlit123"
          fi

          gradle assembleDebug assembleRelease --no-daemon \\
            -Pandroid.injected.signing.store.file="\$(pwd)/release.keystore" \\
            -Pandroid.injected.signing.store.password="\$KS_PASS" \\
            -Pandroid.injected.signing.key.alias="\$KEY_ALIAS" \\
            -Pandroid.injected.signing.key.password="\$KEY_PASS"

          rm -f release.keystore

          mkdir -p "\$GITHUB_WORKSPACE/dist-apk"
          cp app/build/outputs/apk/debug/app-debug.apk "\$GITHUB_WORKSPACE/dist-apk/SunlitOneUI-IconPack-debug.apk"
          if [ -f app/build/outputs/apk/release/app-release.apk ]; then
            cp app/build/outputs/apk/release/app-release.apk "\$GITHUB_WORKSPACE/dist-apk/SunlitOneUI-IconPack-release.apk"
          elif [ -f app/build/outputs/apk/release/app-release-unsigned.apk ]; then
            cp app/build/outputs/apk/release/app-release-unsigned.apk "\$GITHUB_WORKSPACE/dist-apk/SunlitOneUI-IconPack-release-unsigned.apk"
          fi

      - name: Upload APK Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: SunlitOneUI-IconPack-APK
          path: dist-apk/*.apk
          retention-days: 30
`;
}

export function getAndroidProjectFiles(xml: AndroidXmlBundle): Record<string, string> {
  return {
    '.github/workflows/build-apk.yml': getGitHubWorkflowYaml(),
    '.gitignore': `.gradle/
build/
app/build/
.idea/
*.iml
local.properties
*.keystore
*.jks
`,
    'README.md': `# Sunlit OneUI Icon Pack (Samsung Good Lock Compatible)

Android Icon Pack APK built for **Samsung Good Lock -> Theme Park** and standard third-party launchers (Nova, Lawnchair, Niagara, Smart Launcher).

## Cara Build APK Otomatis di GitHub Actions
1. Push repository ini ke GitHub (\`git push origin main\`).
2. Buka tab **Actions** di GitHub repository Anda.
3. Workflow **Build Sunlit OneUI Icon Pack APK** akan berjalan otomatis.
4. Setelah selesai, download artifact **SunlitOneUI-IconPack-APK** yang berisi \`SunlitOneUI-IconPack-release.apk\` (sudah ditandatangani dan siap install).

## Cara Memasang di Samsung Good Lock (Theme Park)
1. Install \`SunlitOneUI-IconPack-release.apk\` di HP Samsung Galaxy Anda.
2. Buka **Good Lock** -> **Theme Park**.
3. Masuk ke tab **Icon** -> tekan **Create New**.
4. Tekan tombol **Iconpack** -> pilih **Sunlit OneUI**.
5. Tekan tombol **Save** (ikon panah kanan atas), beri nama, lalu tekan **Apply**.
`,
    'settings.gradle.kts': `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "SunlitOneUIIconPack"
include(":app")
`,
    'build.gradle.kts': `plugins {
    id("com.android.application") version "8.4.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
`,
    'gradle.properties': `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`,
    'app/build.gradle.kts': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.sunlit.oneui.iconpack"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.sunlit.oneui.iconpack"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
}
`,
    'app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.SET_WALLPAPER" />

    <queries>
        <package android:name="com.samsung.android.themepark" />
        <package android:name="com.samsung.android.goodlock" />
        <package android:name="com.teslacoilsw.launcher" />
        <package android:name="ch.deletescape.lawnchair.plah" />
    </queries>

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher_app"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_launcher_app"
        android:supportsRtl="true"
        android:theme="@style/Theme.SunlitOneUI">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Samsung Good Lock Theme Park & Third-Party Launcher Icon Pack Discovery -->
            <intent-filter>
                <action android:name="com.novalauncher.THEME" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="com.novalauncher.category.CUSTOM_ICON_PICKER" />
            </intent-filter>
            <intent-filter>
                <action android:name="org.adw.launcher.THEMES" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            <intent-filter>
                <action android:name="org.adw.launcher.icons.ACTION_PICK_ICON" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            <intent-filter>
                <action android:name="com.anddoes.launcher.THEME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            <intent-filter>
                <action android:name="com.teslacoilsw.launcher.THEME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            <intent-filter>
                <action android:name="com.gau.go.launcherex.theme" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            <intent-filter>
                <action android:name="com.dlto.atom.launcher.THEME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="com.anddoes.launcher.THEME" />
                <category android:name="com.teslacoilsw.launcher.THEME" />
                <category android:name="com.fede.launcher.THEME_ICONPACK" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
    'app/src/main/res/values/strings.xml': `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Sunlit OneUI</string>
    <string name="subtitle">Icon Pack for Samsung Good Lock Theme Park</string>
    <string name="btn_open_themepark">Buka Theme Park (Good Lock)</string>
    <string name="btn_apply_wallpaper">Pasang Wallpaper Sunset</string>
    <string name="guide_title">Cara Terapkan di Samsung Good Lock</string>
    <string name="guide_steps">1. Buka Good Lock &gt; Theme Park &gt; tab Icon.\n2. Tekan Create New &gt; pilih tombol Iconpack.\n3. Pilih Sunlit OneUI lalu tekan Save &amp; Apply.</string>
</resources>
`,
    'app/src/main/res/values/themes.xml': `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.SunlitOneUI" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">#1D6CF0</item>
        <item name="colorOnPrimary">#FFFFFF</item>
    </style>
</resources>
`,
    'app/src/main/res/xml/appfilter.xml': xml.appfilterXml,
    'app/src/main/res/xml/drawable.xml': xml.drawableXml,
    'app/src/main/res/values/iconpack.xml': xml.iconpackXml,
    'app/src/main/java/com/sunlit/oneui/iconpack/MainActivity.kt': `package com.sunlit.oneui.iconpack

import android.app.Activity
import android.app.WallpaperManager
import android.content.Intent
import android.graphics.BitmapFactory
import android.graphics.Color
import android.graphics.Typeface
import android.net.Uri
import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.GridLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private data class PackIcon(val drawableRes: Int, val label: String)

    private val icons by lazy {
        listOf(
            PackIcon(R.drawable.ic_clock, "Clock"),
            PackIcon(R.drawable.ic_calendar, "Calendar"),
            PackIcon(R.drawable.ic_launcher_app, "Launcher"),
            PackIcon(R.drawable.ic_games, "Games"),
            PackIcon(R.drawable.ic_videocall, "VideoCall"),
            PackIcon(R.drawable.ic_docs, "Docs"),
            PackIcon(R.drawable.ic_calculator, "Calculator"),
            PackIcon(R.drawable.ic_settings, "Settings"),
            PackIcon(R.drawable.ic_maps, "Maps"),
            PackIcon(R.drawable.ic_files, "Files"),
            PackIcon(R.drawable.ic_phone, "Phone"),
            PackIcon(R.drawable.ic_messages, "Messages"),
            PackIcon(R.drawable.ic_gallery, "Gallery"),
            PackIcon(R.drawable.ic_camera, "Camera")
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val isPickerMode = intent?.action == "org.adw.launcher.icons.ACTION_PICK_ICON" ||
            intent?.action == Intent.ACTION_PICK ||
            intent?.action == Intent.ACTION_GET_CONTENT

        val dp = resources.displayMetrics.density
        val pad = (20 * dp).toInt()

        val scroll = ScrollView(this).apply {
            setBackgroundColor(Color.parseColor("#F6F7F9"))
        }

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(pad, (36 * dp).toInt(), pad, pad)
        }

        val title = TextView(this).apply {
            text = if (isPickerMode) "Pilih Icon Sunlit OneUI" else getString(R.string.app_name)
            textSize = 26f
            setTypeface(null, Typeface.BOLD)
            setTextColor(Color.parseColor("#0F172A"))
        }
        val subtitle = TextView(this).apply {
            text = getString(R.string.subtitle)
            textSize = 14f
            setTextColor(Color.parseColor("#475569"))
            setPadding(0, (4 * dp).toInt(), 0, (16 * dp).toInt())
        }
        root.addView(title)
        root.addView(subtitle)

        if (!isPickerMode) {
            val btnRow = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(0, 0, 0, (16 * dp).toInt())
            }

            val btnThemePark = Button(this).apply {
                text = getString(R.string.btn_open_themepark)
                setBackgroundColor(Color.parseColor("#1D6CF0"))
                setTextColor(Color.WHITE)
                setOnClickListener { openThemePark() }
            }
            val btnWallpaper = Button(this).apply {
                text = getString(R.string.btn_apply_wallpaper)
                setOnClickListener { applySunsetWallpaper() }
            }
            val btnParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = (8 * dp).toInt()
            }
            btnRow.addView(btnThemePark, btnParams)
            btnRow.addView(btnWallpaper, btnParams)

            val guideHeader = TextView(this).apply {
                text = getString(R.string.guide_title)
                textSize = 15f
                setTypeface(null, Typeface.BOLD)
                setTextColor(Color.parseColor("#0F172A"))
                setPadding(0, (8 * dp).toInt(), 0, (4 * dp).toInt())
            }
            val guideBody = TextView(this).apply {
                text = getString(R.string.guide_steps)
                textSize = 13f
                setTextColor(Color.parseColor("#334155"))
                setPadding(0, 0, 0, (16 * dp).toInt())
            }
            btnRow.addView(guideHeader)
            btnRow.addView(guideBody)
            root.addView(btnRow)
        }

        val grid = GridLayout(this).apply {
            columnCount = 4
            useDefaultMargins = true
        }

        val iconSize = (64 * dp).toInt()
        for (item in icons) {
            val cell = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                gravity = Gravity.CENTER
                setPadding((6 * dp).toInt(), (8 * dp).toInt(), (6 * dp).toInt(), (8 * dp).toInt())
                setOnClickListener {
                    if (isPickerMode) {
                        val bmp = BitmapFactory.decodeResource(resources, item.drawableRes)
                        val result = Intent().apply {
                            putExtra("icon", bmp)
                            putExtra(
                                Intent.EXTRA_SHORTCUT_ICON_RESOURCE,
                                Intent.ShortcutIconResource.fromContext(this@MainActivity, item.drawableRes)
                            )
                        }
                        setResult(Activity.RESULT_OK, result)
                        finish()
                    } else {
                        Toast.makeText(this@MainActivity, "\${item.label} siap diterapkan via Theme Park", Toast.LENGTH_SHORT).show()
                    }
                }
            }

            val iv = ImageView(this).apply {
                setImageResource(item.drawableRes)
                scaleType = ImageView.ScaleType.FIT_CENTER
            }
            val ivParams = LinearLayout.LayoutParams(iconSize, iconSize)
            val tv = TextView(this).apply {
                text = item.label
                textSize = 11f
                setTextColor(Color.parseColor("#1E293B"))
                gravity = Gravity.CENTER
                setPadding(0, (6 * dp).toInt(), 0, 0)
            }
            cell.addView(iv, ivParams)
            cell.addView(tv)

            val cellParams = GridLayout.LayoutParams().apply {
                width = 0
                columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
            }
            grid.addView(cell, cellParams)
        }

        root.addView(grid)
        scroll.addView(root)
        setContentView(scroll)
    }

    private fun openThemePark() {
        val packages = listOf("com.samsung.android.themepark", "com.samsung.android.goodlock")
        for (pkg in packages) {
            val launch = packageManager.getLaunchIntentForPackage(pkg)
            if (launch != null) {
                startActivity(launch)
                return
            }
        }
        try {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("samsungapps://ProductDetail/com.samsung.android.themepark")))
        } catch (_: Exception) {
            Toast.makeText(this, "Buka Good Lock -> Theme Park -> Icon -> Iconpack -> Sunlit OneUI", Toast.LENGTH_LONG).show()
        }
    }

    private fun applySunsetWallpaper() {
        try {
            val wm = WallpaperManager.getInstance(this)
            wm.setResource(R.drawable.wallpaper_sunset)
            Toast.makeText(this, "Wallpaper Sunset berhasil diterapkan!", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "Gagal memasang wallpaper: \${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }
}
`,
  };
}
