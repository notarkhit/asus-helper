# `asusctl` Help Map

Probed locally on 2026-04-07 from `/usr/bin/asusctl` using `--help` on the root command and each discovered subcommand.

Note: `asusctl info` without `--help` could not be executed inside the current sandbox because it attempted an operation denied by the environment. The help surface was still fully readable.

## Root

```text
Usage: asusctl <command> [<args>]
```

Top-level commands:

- `aura`: aura device commands
- `leds`: keyboard brightness control
- `profile`: profile management
- `fan-curve`: fan curve commands
- `anime`: anime commands
- `slash`: slash ledbar commands
- `scsi`: scsi LED commands
- `armoury`: armoury / firmware attributes
- `backlight`: backlight options
- `battery`: battery options
- `info`: show program version and system info

## Tree

```text
asusctl
├── aura
│   ├── power
│   │   ├── keyboard
│   │   ├── logo
│   │   ├── lightbar
│   │   ├── lid
│   │   ├── rear-glow
│   │   └── ally
│   ├── power-tuf
│   └── effect
│       ├── static
│       ├── breathe
│       ├── rainbow-cycle
│       ├── rainbow-wave
│       ├── stars
│       ├── rain
│       ├── highlight
│       ├── laser
│       ├── ripple
│       ├── pulse
│       ├── comet
│       └── flash
├── leds
│   ├── set
│   ├── get
│   ├── next
│   └── prev
├── profile
│   ├── next
│   ├── list
│   ├── get
│   └── set
├── fan-curve
├── anime
│   ├── image
│   ├── pixel-image
│   ├── gif
│   ├── pixel-gif
│   └── set-builtins
├── slash
├── scsi
├── armoury
│   ├── set
│   ├── get
│   └── list
├── backlight
├── battery
│   ├── limit
│   ├── oneshot
│   └── info
└── info
```

## Root Commands

### `asusctl aura`

```text
Usage: asusctl aura <command> [<args>]
```

- `power`: aura power
- `power-tuf`: aura power for old ROGs and TUF laptops
- `effect`: LED mode commands

#### `asusctl aura power`

```text
Usage: asusctl aura power [<command>] [<args>]
```

- `keyboard`: set power states for keyboard zone
- `logo`: set power states for logo zone
- `lightbar`: set power states for lightbar zone
- `lid`: set power states for lid zone
- `rear-glow`: set power states for rear glow zone
- `ally`: set power states for ally zone

Leaf usages:

- `asusctl aura power keyboard [--boot] [--awake] [--sleep] [--shutdown]`
- `asusctl aura power logo [--boot] [--awake] [--sleep] [--shutdown]`
- `asusctl aura power lightbar [--boot] [--awake] [--sleep] [--shutdown]`
- `asusctl aura power lid [--boot] [--awake] [--sleep] [--shutdown]`
- `asusctl aura power rear-glow [--boot] [--awake] [--sleep] [--shutdown]`
- `asusctl aura power ally [--boot] [--awake] [--sleep] [--shutdown]`

Common meaning:

- `--boot`: enable for boot state
- `--awake`: enable for awake state
- `--sleep`: enable for sleep state
- `--shutdown`: enable for shutdown or hibernate state

#### `asusctl aura power-tuf`

```text
Usage: asusctl aura power-tuf [--awake <awake>] [--keyboard] [--lightbar] [--boot <boot>] [--sleep <sleep>]
```

Options:

- `--awake <true|false>`: control LEDs while awake
- `--keyboard`: apply awake setting to keyboard
- `--lightbar`: apply awake setting to lightbar
- `--boot <true|false>`: control boot animations
- `--sleep <true|false>`: control suspend animations

#### `asusctl aura effect`

```text
Usage: asusctl aura effect [--next-mode] [--prev-mode] [<command>] [<args>]
```

Options:

- `--next-mode`: switch to next aura mode
- `--prev-mode`: switch to previous aura mode

Effects:

- `static`: static single-colour effect
- `breathe`: two-colour breathing effect
- `rainbow-cycle`: single speed-based effect
- `rainbow-wave`: single speed effect with direction
- `stars`: two-colour star effect
- `rain`: single speed-based rain effect
- `highlight`: single-colour effect with speed
- `laser`: single-colour effect with speed
- `ripple`: single-colour effect with speed
- `pulse`: single-colour pulse effect
- `comet`: single-colour comet effect
- `flash`: single-colour flash effect

Leaf usages:

- `asusctl aura effect static -c <colour> [--zone <zone>]`
- `asusctl aura effect breathe --colour <colour> --colour2 <colour2> --speed <speed> [--zone <zone>]`
- `asusctl aura effect rainbow-cycle --speed <speed> [--zone <zone>]`
- `asusctl aura effect rainbow-wave --direction <direction> --speed <speed> [--zone <zone>]`
- `asusctl aura effect stars --colour <colour> --colour2 <colour2> --speed <speed> [--zone <zone>]`
- `asusctl aura effect rain --speed <speed> [--zone <zone>]`
- `asusctl aura effect highlight -c <colour> --speed <speed> [--zone <zone>]`
- `asusctl aura effect laser -c <colour> --speed <speed> [--zone <zone>]`
- `asusctl aura effect ripple -c <colour> --speed <speed> [--zone <zone>]`
- `asusctl aura effect pulse -c <colour> [--zone <zone>]`
- `asusctl aura effect comet -c <colour> [--zone <zone>]`
- `asusctl aura effect flash -c <colour> [--zone <zone>]`

Common effect arguments:

- `-c, --colour <hex>`: RGB hex such as `ff00ff`
- `--colour2 <hex>`: second RGB hex where supported
- `--speed <low|med|high>`
- `--direction <up|down|left|right>`
- `--zone <zone>`: zone like `0`, `1`, `one`, `logo`, `lightbar-left`

### `asusctl leds`

```text
Usage: asusctl leds <command> [<args>]
```

Commands:

- `set`: set keyboard brightness `<off, low, med, high>`
- `get`: get current keyboard brightness
- `next`: toggle to next keyboard brightness
- `prev`: toggle to previous keyboard brightness

Leaf usages:

- `asusctl leds set [--] <level>`
- `asusctl leds get`
- `asusctl leds next`
- `asusctl leds prev`

### `asusctl profile`

```text
Usage: asusctl profile <command> [<args>]
```

Commands:

- `next`: toggle to next profile in list
- `list`: list available profiles
- `get`: get profile
- `set`: set profile

Leaf usages:

- `asusctl profile next`
- `asusctl profile list`
- `asusctl profile get`
- `asusctl profile set [-a] [-b] [--] <profile>`

`profile set` options:

- `-a, --ac`: set the profile to use on AC power
- `-b, --battery`: set the profile to use on battery power

### `asusctl fan-curve`

```text
Usage: asusctl fan-curve [--get-enabled] [--default] [--mod-profile <mod-profile>] [--enable-fan-curves <enable-fan-curves>] [--enable-fan-curve <enable-fan-curve>] [--fan <fan>] [--data <data>]
```

Options:

- `--get-enabled`: get enabled fan profiles
- `--default`: reset the active profile's fan curve to default
- `--mod-profile <profile>`: profile to modify or inspect
- `--enable-fan-curves <true|false>`: enable or disable all curves for a profile; requires `--mod-profile`
- `--enable-fan-curve <true|false>`: enable or disable a single fan curve; requires `--mod-profile` and `--fan`
- `--fan <cpu|gpu|mid>`: select fan to modify
- `--data <data>`: curve data like `30c:1%,49c:2%,...`; if `%` is omitted, range is `0-255`

### `asusctl anime`

```text
Usage: asusctl anime [--override-type <override-type>] [--enable-display <enable-display>] [--enable-powersave-anim <enable-powersave-anim>] [--brightness <brightness>] [--clear] [--off-when-unplugged <off-when-unplugged>] [--off-when-suspended <off-when-suspended>] [--off-when-lid-closed <off-when-lid-closed>] [--off-with-his-head <off-with-his-head>] [<command>] [<args>]
```

Top-level options:

- `--override-type <override-type>`: override the display type
- `--enable-display <true|false>`: enable or disable the display
- `--enable-powersave-anim <true|false>`: enable or disable builtin run/powersave animation
- `--brightness <off|low|med|high>`: global base brightness
- `--clear`: clear the display
- `--off-when-unplugged <true|false>`
- `--off-when-suspended <true|false>`
- `--off-when-lid-closed <true|false>`
- `--off-with-his-head <true|false>`

Subcommands:

- `image`: display a PNG image
- `pixel-image`: display a diagonal/pixel-perfect PNG
- `gif`: display an animated GIF
- `pixel-gif`: display an animated diagonal/pixel-perfect GIF
- `set-builtins`: change which builtin animations are shown

Leaf usages:

- `asusctl anime image --path <path> [--scale <scale>] [--x-pos <x-pos>] [--y-pos <y-pos>] [--angle <angle>] [--bright <bright>]`
- `asusctl anime pixel-image --path <path> [--bright <bright>]`
- `asusctl anime gif --path <path> [--scale <scale>] [--x-pos <x-pos>] [--y-pos <y-pos>] [--angle <angle>] [--bright <bright>] [--loops <loops>]`
- `asusctl anime pixel-gif --path <path> [--bright <bright>] [--loops <loops>]`
- `asusctl anime set-builtins --boot <boot> --awake <awake> --sleep <sleep> --shutdown <shutdown> [--set <set>]`

Leaf argument notes:

- `--path <path>`: full path to PNG or GIF
- `--scale <float>`: `1.0` is normal
- `--x-pos <float>`
- `--y-pos <float>`
- `--angle <radians>`
- `--bright <0.0-1.0>`
- `--loops <n>`: `0` means infinite loop
- `set-builtins --boot|--awake|--sleep|--shutdown`: animation sets, default set used if omitted
- `set-builtins --set <true|false>`: apply the chosen animation set

### `asusctl slash`

```text
Usage: asusctl slash [--enable] [--disable] [-l <brightness>] [--interval <interval>] [--mode <mode>] [--list] [-B <show-on-boot>] [-S <show-on-shutdown>] [-s <show-on-sleep>] [-b <show-on-battery>] [-w <show-battery-warning>]
```

Options:

- `--enable`: enable the Slash ledbar
- `--disable`: disable the Slash ledbar
- `-l, --brightness <0-255>`: set brightness
- `--interval <0-5>`: set interval
- `--mode <mode>`: set `SlashMode`; use `--list` for options
- `--list`: list available animations
- `-B, --show-on-boot <true|false>`
- `-S, --show-on-shutdown <true|false>`
- `-s, --show-on-sleep <true|false>`
- `-b, --show-on-battery <true|false>`
- `-w, --show-battery-warning <true|false>`

### `asusctl scsi`

```text
Usage: asusctl scsi [--enable <enable>] [--mode <mode>] [--speed <speed>] [--direction <direction>] [--colours <colours...>] [--list]
```

Options:

- `--enable <true|false>`: enable SCSI drive LEDs
- `--mode <mode>`: set LED mode; use `--list` for options
- `--speed <slowest|slow|med|fast|fastest>`
- `--direction <forward|reverse>`
- `--colours <hex>`: repeat to specify up to 4 colours
- `--list`: list available animations

### `asusctl armoury`

```text
Usage: asusctl armoury <command> [<args>]
```

Commands:

- `set`: set an asus-armoury firmware attribute
- `get`: get a firmware attribute from asus-armoury
- `list`: list all firmware attributes supported by asus-armoury

Leaf usages:

- `asusctl armoury set [--] <property> <value>`
- `asusctl armoury get [--] <property>`
- `asusctl armoury list`

### `asusctl backlight`

```text
Usage: asusctl backlight [--screenpad-brightness <screenpad-brightness>] [--screenpad-gamma <screenpad-gamma>] [--sync-screenpad-brightness <sync-screenpad-brightness>]
```

Options:

- `--screenpad-brightness <0-100>`: set screen brightness
- `--screenpad-gamma <0.5-2.2>`: set ScreenPad gamma brightness where `1.0` is linear
- `--sync-screenpad-brightness <true|false>`: sync ScreenPad brightness with primary display

### `asusctl battery`

```text
Usage: asusctl battery <command> [<args>]
```

Commands:

- `limit`: set battery charge limit `<20-100>`
- `oneshot`: one-shot full charge with optional target percent
- `info`: show current battery charge limit

Leaf usages:

- `asusctl battery limit [--] <limit>`
- `asusctl battery oneshot [--] [<percent>]`
- `asusctl battery info`

### `asusctl info`

```text
Usage: asusctl info [--show-supported]
```

Options:

- `--show-supported`: show supported laptop functions

## Notes For This Repo

The current app uses only a small subset of this surface:

- `asusctl profile get`
- `asusctl profile set <profile>`
- `asusctl leds get`
- `asusctl leds set <level>`
- `asusctl battery info`
- `asusctl battery limit <limit>`
- `asusctl aura effect static -c <colour>`
- `asusctl aura effect breathe --colour <colour> --colour2 <colour2> --speed <speed>`
- `asusctl aura effect rainbow-cycle --speed <speed>`
- `asusctl aura effect rainbow-wave --direction <direction> --speed <speed>`
- `asusctl aura effect pulse -c <colour>`
