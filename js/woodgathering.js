const trees = [
    {
        type: "Normal",
        level: "1",
        interval: 3000,
        xp: 10,
        media: ""
    },
    {
        type: "Pine",
        level: "1",
        interval: 4000,
        xp: 15,
        media: ""
    },
];

var bonusSpeed = [0, 5, 10, 20, 30, 35, 40, 45, 50];
var treeCutLimit = 1;
var currentlyCutting = false;
var treeCuttingHandler = null;
//var treeAutoHandler = [false, false, false, false, false, false, false, false, false];

function cutTree(treeID) {
    console.log("Cutting Wood");
    if (treeID != null && !currentlyCutting) {
        currentlyCutting = true;
        treeCuttingHandler = treeID
        console.log(trees[treeCuttingHandler].type)
        //Math to calculate cutting speed
        let cutInterval = Math.floor(trees[treeID].interval - bonusSpeed[0] / 100 * trees[treeID].interval);
        console.log(`Cut Time ${cutInterval}`);
        console.log("Starting to cut Tree!");
        $("#chopWood").text("Stop Cutting Wood");
        setTimeout(cuttingTree, cutInterval)

    }else{
        currentlyCutting = false
    }
}

function cuttingTree() {
    console.log(`You Cut Down ${trees[treeCuttingHandler].type}`);
    GAMEVAR.TradeXP.WoodCutting += trees[treeCuttingHandler].xp
    console.log(GAMEVAR.TradeXP.WoodCutting);
    //SweetAlert2
    Swal.fire(
        `${trees[treeCuttingHandler].type} was cut!`,
        'Got Wood ?',
        'success'
    )


    Toastify({
        text: `${trees[treeCuttingHandler].type} +1`,
        duration: 3000
    }).showToast();

    $("#pineXP").text("Pine XP : " + GAMEVAR.TradeXP.WoodCutting);
    treeCuttingHandler = null;
}