
$(document).ready(function () {

    var player = {
        //Stats
        level: 1,
        gold: 0,
        experience: 0,

        //Armor Items
        head: {},
        cheast: {},
        shoulder: {},
        gloves: {},
        leg: {},
        boot: {},
        ring: {},
        relic: {},
        necklace: {},
        weapon: {},

        //Total Stats
        totalHealth: 0,
        totalMana: 0,
        totalDodge: 0,
        totalMagicPower: 0,
        totalIceDamage: 0,
        totalFireDamage: 0,
        totalNatureDamage: 0,
        totalChaosDamage: 0,
        totalCritical: 0,
        totalHealPower: 0,
        totalLifeSteal: 0,

        //Spell CoolDown
        AttackCooldown: {
            basicAttackCooldown: false,
            specialAttackCooldown: false,
            racialCooldown: false
        },

        //Buffs
        buffHealth: 0,
        buffMana: 0,
        buffDodge: 0,
        buffMagicPower: 0,
        buffDamage: 0,
        buffIceDamage: 0,
        buffFireDamage: 0,
        buffWaterDamage: 0,
        buffNatureDamage: 0,
        buffChaosDamage: 0,
        buffCritical: 0,
        buffHealPower: 0,
        buffLifeSteal: 0,

        //Debuff
        debuffHealth: 0,
        debuffMana: 0,
        debuffDodge: 0,
        debuffMagicPower: 0,
        debuffDamage: 0,
        debuffIceDamage: 0,
        debuffFireDamage: 0,
        debuffNatureDamage: 0,
        debuffChaosDamage: 0,
        debuffCritical: 0,
        debuffHealPower: 0,
        debuffLifeSteal: 0,

    }
    var Health = 200 * player.level + player.buffHealth + player.totalHealth - player.debuffHealth;

    var currentPlayerHealth;
    var currentPlayerMana;

    var inventory = {
        i1: {},
        i2: {},
        i3: {},
        i4: {},
        i5: {},
    }

    //Functions

    //Display Stat Function
    function displaystats() {

        //$("#health").text(Math.floor(Health));
        //$("#mana").text(Math.floor(Mana));
        //$("#damage").text(Math.floor(Damage));
        //$("#critical").text(Math.floor(Critical));
        //$("#dodge").text(Math.floor(Dodge));
        //$("#healpow").text(Math.floor(HealPow));
        //$("#magicpow").text(Math.floor(MagicPow));
        //$("#ice").text(Math.floor(IceDMG));
        //$("#fire").text(Math.floor(FireDMG));
        //$("#storm").text(Math.floor(StormDMG));
        //$("#nature").text(Math.floor(NatureDMG));
        //$("#shadow").text(Math.floor(ShadowDMG));
        //$("#blood").text(Math.floor(BloodDMG));
        //$("#lifesteal").text(Math.floor(Lifesteal));

        $("#gold").text("Gold: " + Math.floor(player.gold));
        $("#level").text("Level: " + player.level);
        $("#health").text("Total Health: " + Math.floor(Health));
    }

    function cutWood() {
        cutTree(1);
    }


    //OnClick
    $("#charStatsPage").click(function () {
        displaystats();
    });

    $("#chopWood").click(function() {
        cutWood(1);
    });


    //Window methods
    window.onload = function () {
        console.log("HELLO World!!!")
        console.log(Health)
        console.log(player)
        //displaystats();
    };
    //ifVisable.js 
    ifvisible.on("blur", function () {
        // example code here..
        //SweetAlert2
        Swal.fire(
            `Idle State`,
            'Tabbed Out enter idle state',
            'error'
        )
    });

    ifvisible.on("focus", function () {
        // resume all animations
        Swal.fire(
            `Idle State`,
            'Back from Idle State.',
            'warning'
        )
    });
}); // doc ready