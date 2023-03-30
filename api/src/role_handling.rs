use crate::constants::{
    persistent_roles, roles, BeyondRequirements, MetabitRequirements, PaleoRequirements,
    SimulationRequirements, C2SGUILD,
};
use crate::errors::{InternalErrorConverter, MyError};
use crate::models::UserData;
use twilight_http::Client;
use twilight_model::id::marker::{GuildMarker, RoleMarker, UserMarker};
use twilight_model::{guild::Member, id::Id};

pub async fn handle_roles(
    user_data: &UserData,
    discord_token: String,
) -> Result<Vec<&'static str>, MyError> {
    let mut gained_roles: Vec<&'static str> = Vec::new();
    let client = Client::new(discord_token);
    let guild_id = Id::<GuildMarker>::new(C2SGUILD);
    let user_id = Id::<UserMarker>::new(
        str::parse::<u64>(&user_data.discord_id)
            .make_internal_error("parsing discord id failed")?,
    );

    let member_data = client
        .guild_member(guild_id, user_id)
        .await
        .make_internal_error(
        "failed retrieving member data (this usually occurs when you're not in the Discord server)",
    )?;
    let member_data = member_data
        .model()
        .await
        .make_internal_error("failed at parsing the member data to a Member struct")?;

    let mut gained_metabit_roles = handle_metabit_roles(&mut gained_roles, &member_data, user_data);
    let mut gained_paleo_roles = handle_paleo_roles(&mut gained_roles, &member_data, user_data);
    let mut gained_beyond_roles = handle_beyond_roles(&mut gained_roles, &member_data, user_data);
    let mut gained_simulation_roles =
        handle_simulation_roles(&mut gained_roles, &member_data, user_data);

    let mut applyable_roles = persistent_roles::PERSISTENT_ROLES
        .into_iter()
        .map(Id::<RoleMarker>::new)
        .filter(|role| member_data.roles.contains(role))
        .collect::<Vec<Id<RoleMarker>>>();

    applyable_roles.append(&mut gained_metabit_roles);
    applyable_roles.append(&mut gained_paleo_roles);
    applyable_roles.append(&mut gained_beyond_roles);
    applyable_roles.append(&mut gained_simulation_roles);

    let updated_member_data = client
        .update_guild_member(guild_id, user_id)
        .roles(applyable_roles.as_slice())
        .await
        .make_internal_error("failed at updating member roles")?;
    updated_member_data
        .model()
        .await
        .make_internal_error("failed at parsing member data model")?;

    Ok(gained_roles)
}

fn handle_metabit_roles(
    gained_roles: &mut Vec<&'static str>,
    member: &Member,
    user_data: &UserData,
) -> Vec<Id<RoleMarker>> {
    // the length of the vector will always be 1 to simplify the process of combining the roles array
    let mut applyable_roles: Vec<Id<RoleMarker>> = Vec::new();

    if user_data.metabits >= MetabitRequirements::RealityLegend as i64 {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::REALITY_LEGEND,
            "Reality Legend",
        ));
    } else if user_data.metabits >= MetabitRequirements::RealityExpert as i64 {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::REALITY_EXPERT,
            "Reality Expert",
        ));
    } else if user_data.metabits >= MetabitRequirements::RealityExplorer as i64 {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::REALITY_EXPLORER,
            "Reality Explorer",
        ));
    }

    applyable_roles
}

fn handle_paleo_roles(
    gained_roles: &mut Vec<&'static str>,
    member: &Member,
    user_data: &UserData,
) -> Vec<Id<RoleMarker>> {
    // the length of the vector will always be 1 to simplify the process of combining the roles array
    let mut applyable_roles: Vec<Id<RoleMarker>> = Vec::new();
    let dino_prestige = (user_data.dino_rank / 50).clamp(0, 10);

    if dino_prestige == PaleoRequirements::PaleontologistLegend as i32 {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::PALEONTOLOGIST_LEGEND,
            "Paleontologist Legend",
        ));
    } else if dino_prestige == PaleoRequirements::ProgressivePaleontologist as i32 {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::PROGRESSIVE_PALEONTOLOGIST,
            "Progressive Paleontologist",
        ));
    } else if user_data.dino_rank >= PaleoRequirements::Paleontologist as i32 {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::PALEONTOLOGIST,
            "Paleontologist",
        ));
    }

    applyable_roles
}

fn handle_beyond_roles(
    gained_roles: &mut Vec<&'static str>,
    member: &Member,
    user_data: &UserData,
) -> Vec<Id<RoleMarker>> {
    // the length of the vector will always be 1 to simplify the process of combining the roles array
    let mut applyable_roles: Vec<Id<RoleMarker>> = Vec::new();

    if user_data.beyond_rank == BeyondRequirements::PlanetaryExplorer as i32 {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::PLANETARY_EXPLORER,
            "Planetary Explorer",
        ));
    }

    applyable_roles
}

fn handle_simulation_roles(
    gained_roles: &mut Vec<&'static str>,
    member: &Member,
    user_data: &UserData,
) -> Vec<Id<RoleMarker>> {
    // the length of the vector will always be 1 to simplify the process of combining the roles array
    let mut applyable_roles: Vec<Id<RoleMarker>> = Vec::new();

    if user_data.all_hidden_achievements_obtained {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::FINDER_OF_SEMBLANCE_SECRETS,
            "Finder of Semblance's Secrets",
        ));
    } else {
        let speedrun_time = if user_data.singularity_speedrun_time.is_some() {
            user_data.singularity_speedrun_time.unwrap()
        } else {
            1000.0
        };
        if speedrun_time <= SimulationRequirements::SonicSpeedsterOfSimulations as i32 as f64 {
            applyable_roles.push(apply_a_role(
                gained_roles,
                member,
                roles::SONIC_SPEEDSTER_OF_SIMULATIONS,
                "Sonic Speedster of Simulations",
            ));
        } else if speedrun_time <= SimulationRequirements::SimulationSpeedster as i32 as f64 {
            applyable_roles.push(apply_a_role(
                gained_roles,
                member,
                roles::SIMULATION_SPEEDSTER,
                "Simulation Speedster",
            ));
        }

        if user_data.all_sharks_obtained {
            applyable_roles.push(apply_a_role(
                gained_roles,
                member,
                roles::SHARK_COLLECTOR,
                "Shark Collector",
            ));
        }
    }

    if user_data.beta_tester {
        applyable_roles.push(apply_a_role(
            gained_roles,
            member,
            roles::BETA_TESTER,
            "Beta Tester",
        ));
    }

    applyable_roles
}

fn apply_a_role(
    gained_roles: &mut Vec<&'static str>,
    member: &Member,
    role_id: u64,
    role_name: &'static str,
) -> Id<RoleMarker> {
    let role = Id::<RoleMarker>::new(role_id);
    if !member.roles.contains(&role) {
        gained_roles.push(role_name);
    }
    role
}
