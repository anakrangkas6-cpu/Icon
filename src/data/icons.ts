export type IconId =
  | 'clock'
  | 'calendar'
  | 'launcher'
  | 'games'
  | 'videocall'
  | 'docs'
  | 'calculator'
  | 'settings'
  | 'maps'
  | 'files'
  | 'phone'
  | 'messages'
  | 'gallery'
  | 'camera';

export type IconShape = 'squircle' | 'rounded' | 'circle' | 'teardrop';

export interface IconPackageMapping {
  appName: string;
  componentInfo: string;
}

export interface IconSpec {
  id: IconId;
  drawableName: string;
  label: string;
  category: 'widget' | 'grid' | 'dock';
  palette: string[];
  description: string;
  mappings: IconPackageMapping[];
}

export const ICON_SPECS: IconSpec[] = [
  {
    id: 'clock',
    drawableName: 'ic_clock',
    label: 'Clock',
    category: 'widget',
    palette: ['#050506', '#14448C', '#3996F3', '#E2F6FF'],
    description: 'Obsidian sky fading into electric blue horizon glow with stacked metallic 09 / 35 numerals.',
    mappings: [
      { appName: 'Samsung Clock', componentInfo: 'ComponentInfo{com.sec.android.app.clockpackage/com.sec.android.app.clockpackage.ClockPackage}' },
      { appName: 'Google Clock', componentInfo: 'ComponentInfo{com.google.android.deskclock/com.android.deskclock.DeskClock}' },
      { appName: 'AOSP DeskClock', componentInfo: 'ComponentInfo{com.android.deskclock/com.android.deskclock.DeskClock}' },
    ],
  },
  {
    id: 'calendar',
    drawableName: 'ic_calendar',
    label: 'Calendar',
    category: 'widget',
    palette: ['#E9DEC9', '#1D7491', '#FFFFFF'],
    description: 'Full-bleed sunlit beach selfie photo card with bold drop-shadowed 12 Jan date stamp.',
    mappings: [
      { appName: 'Samsung Calendar', componentInfo: 'ComponentInfo{com.samsung.android.calendar/com.samsung.android.app.calendar.activity.MainActivity}' },
      { appName: 'Samsung Calendar (Legacy)', componentInfo: 'ComponentInfo{com.samsung.android.calendar/com.android.calendar.AllInOneActivity}' },
      { appName: 'Google Calendar', componentInfo: 'ComponentInfo{com.google.android.calendar/com.android.calendar.AllInOneActivity}' },
    ],
  },
  {
    id: 'launcher',
    drawableName: 'ic_launcher_app',
    label: 'Launcher',
    category: 'grid',
    palette: ['#F6F6F6', '#E8E8E6', '#121316'],
    description: 'Soft 3D cushion white squircle featuring crisp centered 27 numeral.',
    mappings: [
      { appName: 'One UI Home', componentInfo: 'ComponentInfo{com.sec.android.app.launcher/com.sec.android.app.launcher.activities.LauncherActivity}' },
      { appName: 'Good Lock', componentInfo: 'ComponentInfo{com.samsung.android.goodlock/com.samsung.android.goodlock.MainActivity}' },
      { appName: 'Theme Park', componentInfo: 'ComponentInfo{com.samsung.android.themepark/com.samsung.android.themepark.MainActivity}' },
      { appName: 'Nova Launcher', componentInfo: 'ComponentInfo{com.teslacoilsw.launcher/com.teslacoilsw.launcher.NovaLauncher}' },
    ],
  },
  {
    id: 'games',
    drawableName: 'ic_games',
    label: 'Games',
    category: 'grid',
    palette: ['#F44765', '#EF2B53', '#FFFFFF'],
    description: 'Rose-crimson gradient squircle with sculpted white controller, D-pad cutout, and diamond action buttons.',
    mappings: [
      { appName: 'Samsung Gaming Hub', componentInfo: 'ComponentInfo{com.samsung.android.game.gamehome/com.samsung.android.game.gamehome.activity.StartActivity}' },
      { appName: 'Google Play Games', componentInfo: 'ComponentInfo{com.google.android.play.games/com.google.android.gms.games.ui.destination.main.MainActivity}' },
    ],
  },
  {
    id: 'videocall',
    drawableName: 'ic_videocall',
    label: 'VideoCall',
    category: 'grid',
    palette: ['#50EB63', '#25C340', '#161A18', '#8A2BE2'],
    description: 'Vibrant emerald gradient with dark vertical audio spectrum bars and violet indicator needle.',
    mappings: [
      { appName: 'Google Meet', componentInfo: 'ComponentInfo{com.google.android.apps.tachyon/com.google.android.apps.tachyon.MainActivity}' },
      { appName: 'Google Meet (Meetings)', componentInfo: 'ComponentInfo{com.google.android.apps.meetings/com.google.android.apps.meetings.SplashActivity}' },
      { appName: 'Samsung Video Call', componentInfo: 'ComponentInfo{com.samsung.android.videocall/com.samsung.android.videocall.VideoCallActivity}' },
      { appName: 'Zoom', componentInfo: 'ComponentInfo{us.zoom.videomeetings/com.zipow.videobox.LauncherActivity}' },
    ],
  },
  {
    id: 'docs',
    drawableName: 'ic_docs',
    label: 'Docs',
    category: 'grid',
    palette: ['#9853D2', '#E539A5', '#96B356', '#EE6A3A'],
    description: 'Four-corner spectrum mesh with 45-degree frosted translucent glass paintbrush.',
    mappings: [
      { appName: 'Google Docs', componentInfo: 'ComponentInfo{com.google.android.apps.docs.editors.docs/com.google.android.apps.docs.app.NewMainProxyActivity}' },
      { appName: 'Google Drive', componentInfo: 'ComponentInfo{com.google.android.apps.docs/com.google.android.apps.docs.app.NewMainProxyActivity}' },
      { appName: 'Samsung Notes', componentInfo: 'ComponentInfo{com.samsung.android.app.notes/com.samsung.android.app.notes.memolist.MemoListActivity}' },
    ],
  },
  {
    id: 'calculator',
    drawableName: 'ic_calculator',
    label: 'Calculator',
    category: 'grid',
    palette: ['#F7F8FA', '#E2E3E7', '#1D1E22', '#63AAD8'],
    description: 'Light cushion squircle housing a dark pocket calculator with 123 LCD display and tall cyan equals key.',
    mappings: [
      { appName: 'Samsung Calculator', componentInfo: 'ComponentInfo{com.sec.android.app.popupcalculator/com.sec.android.app.popupcalculator.Calculator}' },
      { appName: 'Google Calculator', componentInfo: 'ComponentInfo{com.google.android.calculator/com.android.calculator2.Calculator}' },
      { appName: 'AOSP Calculator', componentInfo: 'ComponentInfo{com.android.calculator2/com.android.calculator2.Calculator}' },
    ],
  },
  {
    id: 'settings',
    drawableName: 'ic_settings',
    label: 'Settings',
    category: 'grid',
    palette: ['#F7F5F6', '#DDDDDD', '#18191C'],
    description: 'Matte pearl cushion squircle with bold 8-tooth charcoal cogwheel and soft elevation shadow.',
    mappings: [
      { appName: 'Android / One UI Settings', componentInfo: 'ComponentInfo{com.android.settings/com.android.settings.Settings}' },
      { appName: 'Settings Homepage', componentInfo: 'ComponentInfo{com.android.settings/com.android.settings.homepage.SettingsHomepageActivity}' },
    ],
  },
  {
    id: 'maps',
    drawableName: 'ic_maps',
    label: 'Maps',
    category: 'grid',
    palette: ['#51AEEB', '#0858C8', '#FFFFFF'],
    description: 'Deep cobalt gradient squircle with luminous circular compass ring and split-shaded north arrow.',
    mappings: [
      { appName: 'Google Maps', componentInfo: 'ComponentInfo{com.google.android.apps.maps/com.google.android.maps.MapsActivity}' },
      { appName: 'Waze', componentInfo: 'ComponentInfo{com.waze/com.waze.FreeMapAppActivity}' },
    ],
  },
  {
    id: 'files',
    drawableName: 'ic_files',
    label: 'Files',
    category: 'grid',
    palette: ['#FAF5F1', '#E6E8F4', '#21ADFA'],
    description: 'Ivory cushion squircle with electric sky-blue folder silhouette and embossed white G monogram.',
    mappings: [
      { appName: 'Samsung My Files', componentInfo: 'ComponentInfo{com.sec.android.app.myfiles/com.sec.android.app.myfiles.external.ui.MainActivity}' },
      { appName: 'Samsung My Files (Common)', componentInfo: 'ComponentInfo{com.sec.android.app.myfiles/com.sec.android.app.myfiles.common.MainActivity}' },
      { appName: 'Files by Google', componentInfo: 'ComponentInfo{com.google.android.apps.nbu.files/com.google.android.apps.nbu.files.home.HomeActivity}' },
      { appName: 'AOSP Files', componentInfo: 'ComponentInfo{com.android.documentsui/com.android.documentsui.files.FilesActivity}' },
    ],
  },
  {
    id: 'phone',
    drawableName: 'ic_phone',
    label: 'Phone',
    category: 'dock',
    palette: ['#50E466', '#25BE3F', '#FFFFFF'],
    description: 'Fresh emerald gradient squircle with crisp tilted white telephone receiver.',
    mappings: [
      { appName: 'Samsung Phone', componentInfo: 'ComponentInfo{com.samsung.android.dialer/com.samsung.android.dialer.DialtactsActivity}' },
      { appName: 'Google Phone', componentInfo: 'ComponentInfo{com.google.android.dialer/com.google.android.dialer.extensions.GoogleDialtactsActivity}' },
      { appName: 'AOSP Dialer', componentInfo: 'ComponentInfo{com.android.dialer/com.android.dialer.main.impl.MainActivity}' },
      { appName: 'Samsung Contacts', componentInfo: 'ComponentInfo{com.samsung.android.app.contacts/com.samsung.android.app.contacts.contactslist.PeopleActivity}' },
    ],
  },
  {
    id: 'messages',
    drawableName: 'ic_messages',
    label: 'Messages',
    category: 'dock',
    palette: ['#7259F2', '#4F36D2', '#FFFFFF'],
    description: 'Electric indigo-violet gradient with crisp white speech bubble and three horizontal dots.',
    mappings: [
      { appName: 'Samsung Messages', componentInfo: 'ComponentInfo{com.samsung.android.messaging/com.samsung.android.messaging.ui.view.main.WithActivity}' },
      { appName: 'Google Messages', componentInfo: 'ComponentInfo{com.google.android.apps.messaging/com.google.android.apps.messaging.ui.ConversationListActivity}' },
      { appName: 'AOSP MMS', componentInfo: 'ComponentInfo{com.android.mms/com.android.mms.ui.ConversationList}' },
    ],
  },
  {
    id: 'gallery',
    drawableName: 'ic_gallery',
    label: 'Gallery',
    category: 'dock',
    palette: ['#F6F6F4', '#EAEAEA', '#077EFC', '#056CCB'],
    description: 'Soft white cushion squircle featuring overlapping cobalt geometric peaks and dark sun disc.',
    mappings: [
      { appName: 'Samsung Gallery', componentInfo: 'ComponentInfo{com.sec.android.gallery3d/com.sec.android.gallery3d.app.GalleryActivity}' },
      { appName: 'Google Photos', componentInfo: 'ComponentInfo{com.google.android.apps.photos/com.google.android.apps.photos.home.HomeActivity}' },
    ],
  },
  {
    id: 'camera',
    drawableName: 'ic_camera',
    label: 'Camera',
    category: 'dock',
    palette: ['#F0F0EE', '#B4B1AC', '#0F1722', '#3B82F6'],
    description: 'Sculpted silver-cushion squircle with raised metallic bezel, matte barrel, and cyan-glinted optical lens.',
    mappings: [
      { appName: 'Samsung Camera', componentInfo: 'ComponentInfo{com.sec.android.app.camera/com.sec.android.app.camera.Camera}' },
      { appName: 'Google Camera', componentInfo: 'ComponentInfo{com.google.android.GoogleCamera/com.android.camera.CameraLauncher}' },
      { appName: 'AOSP Camera2', componentInfo: 'ComponentInfo{com.android.camera2/com.android.camera.CameraLauncher}' },
    ],
  },
];

export function generateAppFilterXml(): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
    '    <!-- Sunlit OneUI Icon Pack: Samsung Good Lock Theme Park & Third-Party Launcher Mappings -->',
    '    <iconback img1="icon_back" />',
    '    <iconmask img1="icon_mask" />',
    '    <iconupon img1="icon_upon" />',
    '    <scale factor="0.78" />',
    '',
  ];

  for (const spec of ICON_SPECS) {
    lines.push(`    <!-- ${spec.label} -->`);
    for (const mapping of spec.mappings) {
      lines.push(`    <item component="${mapping.componentInfo}" drawable="${spec.drawableName}" />`);
    }
    lines.push('');
  }

  lines.push('</resources>');
  return lines.join('\n');
}

export function generateDrawableXml(): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
    '    <version>1</version>',
    '    <category title="Widgets &amp; Essentials" />',
  ];

  for (const spec of ICON_SPECS.filter((s) => s.category === 'widget')) {
    lines.push(`    <item drawable="${spec.drawableName}" />`);
  }

  lines.push('    <category title="Core Apps" />');
  for (const spec of ICON_SPECS.filter((s) => s.category === 'grid')) {
    lines.push(`    <item drawable="${spec.drawableName}" />`);
  }

  lines.push('    <category title="Dock" />');
  for (const spec of ICON_SPECS.filter((s) => s.category === 'dock')) {
    lines.push(`    <item drawable="${spec.drawableName}" />`);
  }

  lines.push('</resources>');
  return lines.join('\n');
}

export function generateIconPackXml(): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources xmlns:tools="http://schemas.android.com/tools" tools:ignore="MissingTranslation">',
    '    <string-array name="icon_pack">',
  ];

  for (const spec of ICON_SPECS) {
    lines.push(`        <item>${spec.drawableName}</item>`);
  }

  lines.push('    </string-array>');
  lines.push('</resources>');
  return lines.join('\n');
}
