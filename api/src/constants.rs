pub mod roles {
    pub const PALEONTOLOGIST_LEGEND: u64 = 892_352_619_526_377_473;
    pub const FINDER_OF_SEMBLANCE_SECRETS: u64 = 892_352_829_640_032_306;
    pub const SHARK_COLLECTOR: u64 = 892_352_933_478_400_041;
    pub const SONIC_SPEEDSTER_OF_SIMULATIONS: u64 = 892_353_085_425_459_210;
    pub const REALITY_LEGEND: u64 = 892_353_216_094_814_268;
    pub const PROGRESSIVE_PALEONTOLOGIST: u64 = 892_353_322_026_160_138;
    pub const REALITY_EXPERT: u64 = 892_353_419_409_518_604;
    pub const PLANETARY_EXPLORER: u64 = 922_176_303_153_696_768;
    pub const PALEONTOLOGIST: u64 = 657_305_968_442_474_502;
    pub const SIMULATION_SPEEDSTER: u64 = 892_355_042_865_192_980;
    pub const REALITY_EXPLORER: u64 = 499_316_778_426_433_538;
    pub const BETA_TESTER: u64 = 564_870_410_227_679_254;
}

pub mod persistent_roles {
    /** ```
      pub const DEV: u64 = 493_796_775_132_528_640;
      pub const COUNCIL_OVERSEER: u64 = 567_039_914_294_771_742;
      pub const MARTIAN_COUNCIL: u64 = 535_129_309_648_781_332;
      pub const ALUMNI_DEV: u64 = 739_233_828_064_722_965;
      pub const SERVER_BOOSTER: u64 = 660_930_089_990_488_099;
      pub const MONTHLY_CONTEST_WINNER: u64 = 643_528_653_883_441_203;
      pub const CELLS_FAN_ARTIST: u64 = 762_382_937_668_714_528;
      pub const SERVER_EVENTS: u64 = 776_980_182_070_067_211;
      pub const FELIFORMS: u64 = 808_580_140_262_359_041;
      pub const CANIFORMS: u64 = 808_580_036_022_108_202;
      pub const MUTED: u64 = 718_796_622_867_464_198;
      ```
    **/
    pub const PERSISTENT_ROLES: [u64; 11] = [
        493_796_775_132_528_640,
        567_039_914_294_771_742,
        535_129_309_648_781_332,
        739_233_828_064_722_965,
        660_930_089_990_488_099,
        643_528_653_883_441_203,
        762_382_937_668_714_528,
        776_980_182_070_067_211,
        808_580_140_262_359_041,
        808_580_036_022_108_202,
        718_796_622_867_464_198,
    ];
}

pub const C2SGUILD: u64 = 488_478_892_873_744_385;

// The value must exceed 32 bit for the case of checking if the user actually reached that specific number.
#[allow(clippy::enum_clike_unportable_variant)]
pub enum MetabitRequirements {
    RealityLegend = 100_000_000_000_000,
    RealityExpert = 1_000_000_000,
    RealityExplorer = 1_000_000,
}

pub enum PaleoRequirements {
    // prestige
    PaleontologistLegend = 10,
    // prestige
    ProgressivePaleontologist = 1,
    // dino ranks
    Paleontologist = 26,
}

pub enum SimulationRequirements {
    // seconds
    SonicSpeedsterOfSimulations = 120,
    // seconds
    SimulationSpeedster = 300,
}

pub enum BeyondRequirements {
    // beyond ranks
    PlanetaryExplorer = 15,
}

pub enum ErrorLogType {
    USER(String),
    INTERNAL,
}

pub enum LOG {
    SUCCESSFUL,
    INFORMATIONAL,
    FAILURE,
}

pub const BACKGROUND: &str = "\u{001b}[40m";
pub const SUCCESSFUL: &str = "\u{001b}[0;32m";
pub const INFORMATIONAL: &str = "\u{001b}[1;33m";
pub const FAILURE: &str = "\u{001b}[0;31m";
