package com.sunlit.oneui.iconpack

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
                        Toast.makeText(this@MainActivity, "${item.label} siap diterapkan via Theme Park", Toast.LENGTH_SHORT).show()
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
            Toast.makeText(this, "Gagal memasang wallpaper: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }
}
