import { player, clearInt, interval, format, blankSave } from './Synergism';
import {
    calculateOfferings, CalcCorruptionStuff, calculateCubeBlessings, calculateRuneLevels,
    calculateAnts, calculateObtainium, calculateTalismanEffects, calculateAntSacrificeELO,
    calcAscensionCount, calculateGoldenQuarkGain} from './Calculate';
import { resetofferings } from './Runes';
import { updateTalismanInventory, updateTalismanAppearance } from './Talismans';
import { calculateTesseractBlessings } from './Tesseracts';
import { Alert, revealStuff, updateChallengeDisplay } from './UpdateHTML';
import { upgradeupdate } from './Upgrades';
import { Globals as G } from './Variables';
import Decimal from 'break_infinity.js';
import { getElementById } from './Utility';
import { achievementaward, ascensionAchievementCheck } from './Achievements';
import { buyResearch, updateResearchBG } from './Research';
import { calculateHypercubeBlessings } from './Hypercubes';
import type {
    ResetHistoryEntryPrestige,
    ResetHistoryEntryTranscend,
    ResetHistoryEntryReincarnate,
    ResetHistoryEntryAscend
} from './History';
import { challengeRequirement } from './Challenges';
import { Synergism } from './Events';
import type { Player, resetNames, OneToFive } from './types/Synergism';
import { updateClassList } from './Utility';
import { corrChallengeMinimum, corruptionStatsUpdate, maxCorruptionLevel } from './Corruptions';
import { toggleAutoChallengeModeText, toggleSubTab, toggleTabs } from './Toggles';
import { DOMCacheGetOrSet } from './Cache/DOM';
import { WowCubes } from './CubeExperimental';
import { importSynergism } from './ImportExport';
import { resetShopUpgrades, shopData } from './Shop';
import { QuarkHandler } from './Quark';
import { calculateSingularityDebuff } from './singularity';
import { updateCubeUpgradeBG } from './Cubes';
import { calculateTessBuildingsInBudget, buyTesseractBuilding } from './Buy'
import { getAutoHepteractCrafts } from './Hepteracts'
import type { TesseractBuildings } from './Buy';

let repeatreset: ReturnType<typeof setTimeout>;

export const resetrepeat = (input: resetNames) => {
    clearInt(repeatreset);
    repeatreset = interval(() => resetdetails(input), 50);
}

export const resetdetails = (input: resetNames) => {
    DOMCacheGetOrSet('resetofferings1').style.display = 'block'

    const transcensionChallenge = player.currentChallenge.transcension;
    const reincarnationChallenge = player.currentChallenge.reincarnation;

    const offering = calculateOfferings(input);
    const offeringImage = getElementById<HTMLImageElement>('resetofferings1');
    const offeringText = DOMCacheGetOrSet('resetofferings2');
    const currencyImage1 = getElementById<HTMLImageElement>('resetcurrency1');
    const resetObtainiumImage = DOMCacheGetOrSet('resetobtainium');
    const resetObtainiumText = DOMCacheGetOrSet('resetobtainium2');
    const resetInfo = DOMCacheGetOrSet('resetinfo');
    const resetCurrencyGain = DOMCacheGetOrSet('resetcurrency2');

    (input == 'reincarnation') ?
        (resetObtainiumImage.style.display = 'block', resetObtainiumText.textContent = format(Math.floor(G['obtainiumGain']))):
        (resetObtainiumImage.style.display = 'none', resetObtainiumText.textContent = '');

    (input == 'ascensionChallenge' || input == 'ascension' || input == 'singularity')?
        offeringImage.style.display = offeringText.style.display = 'none':
        offeringImage.style.display = offeringText.style.display = 'block';

    switch (input){
        case 'prestige':
            if (!currencyImage1.src.endsWith('Pictures/Diamond.png')) {
                currencyImage1.src = 'Pictures/Diamond.png'
            }
            currencyImage1.style.display = 'block'
            resetCurrencyGain.textContent = '+' + format(G['prestigePointGain']);
            resetInfo.textContent = 'Coins, Coin Producers, Coin Upgrades, and Crystals are reset, but in return you gain diamonds and a few Offerings. Required: ' + format(player.coinsThisPrestige) + '/1e16 Coins || TIME SPENT: ' + format(player.prestigecounter) + ' Seconds.';
            resetInfo.style.color = 'turquoise';
            break;
        case 'transcension':
            if (!currencyImage1.src.endsWith('Pictures/Mythos.png')) {
                currencyImage1.src = 'Pictures/Mythos.png'
            }
            currencyImage1.style.display = 'block'
            resetCurrencyGain.textContent = '+' + format(G['transcendPointGain']);
            resetInfo.textContent = 'Reset all Coin and Diamond Upgrades/Features, Crystal Upgrades & Producers, for Mythos/Offerings. Required: ' + format(player.coinsThisTranscension) + '/1e100 Coins || TIME SPENT: ' + format(player.transcendcounter) + ' Seconds.';
            resetInfo.style.color = 'orchid';
            break;
        case 'reincarnation':
            if (!currencyImage1.src.endsWith('Pictures/Particle.png')) {
                currencyImage1.src = 'Pictures/Particle.png'
            }
            currencyImage1.style.display = 'block'
            resetCurrencyGain.textContent = '+' + format(G['reincarnationPointGain']);
            resetInfo.textContent = 'Reset ALL previous reset tiers, but you will gain Particles, Obtainium and Offerings! Required: ' + format(player.transcendShards) + '/1e300 Mythos Shards || TIME SPENT: ' + format(player.reincarnationcounter) + ' Seconds.';
            resetInfo.style.color = 'limegreen';
            break;
        case 'acceleratorBoost':
            if (!currencyImage1.src.endsWith('Pictures/Diamond.png')) {
                currencyImage1.src = 'Pictures/Diamond.png'
            }
            currencyImage1.style.display = 'block'
            resetCurrencyGain.textContent = '-' + format(player.acceleratorBoostCost);
            resetInfo.textContent = 'Reset Coin Producers/Upgrades, Crystals and Diamonds in order to increase the power of your Accelerators. Required: ' + format(player.prestigePoints) + '/' + format(player.acceleratorBoostCost) + ' Diamonds.';
            resetInfo.style.color = 'cyan';
            break;
        case 'transcensionChallenge':
            currencyImage1.style.display = 'none'
            resetCurrencyGain.textContent = '';

            (transcensionChallenge !== 0)?
                (resetInfo.style.color = 'aquamarine', resetInfo.textContent = 'Are you tired of being in your Challenge or stuck? Click to leave Challenge ' + transcensionChallenge + '. Progress: ' + format(player.coinsThisTranscension) + '/' + format(challengeRequirement(transcensionChallenge, player.challengecompletions[transcensionChallenge])) + ' Coins. TIME SPENT: ' + format(player.transcendcounter) + ' Seconds.'):
                (resetInfo.style.color = 'crimson', resetInfo.textContent = 'You\'re not in a Transcension Challenge right now. Get in one before you can leave it, duh!');
            break;
        case 'reincarnationChallenge':
            currencyImage1.style.display = 'none'
            resetCurrencyGain.textContent = '';

            if (reincarnationChallenge !== 0) {
                const goal = reincarnationChallenge >= 9 ? 'coins' : 'transcendShards';
                const goaldesc = reincarnationChallenge >= 9 ? ' Coins' : ' Mythos Shards';

                resetInfo.style.color = 'silver';
                resetInfo.textContent = 'Are you done or tired of being in your Challenge? Click to leave Challenge ' + reincarnationChallenge + '. Progress: ' + format(player[goal]) + '/' + format(challengeRequirement(reincarnationChallenge, player.challengecompletions[reincarnationChallenge], reincarnationChallenge)) + goaldesc + '. TIME SPENT: ' + format(player.reincarnationcounter) + ' Seconds.';
            } else {
                resetInfo.style.color = 'crimson';
                resetInfo.textContent = 'You\'re not in a Reincarnation Challenge right now. How could you leave what you are not in?';
            }
            break;
        case 'ascensionChallenge':
            currencyImage1.style.display = 'none'
            resetCurrencyGain.textContent = '';
            resetInfo.textContent = 'Click this if you\'re in an Ascension Challenge and want to leave. You get it already!';
            resetInfo.style.color = 'gold';
            break;
        case 'ascension':
            currencyImage1.style.display = 'none'
            resetCurrencyGain.textContent = '';
            resetInfo.textContent = 'Ascend, C-10 is required! +' + format(CalcCorruptionStuff()[4], 0, true) + ' Wow! Cubes for doing it! Time: ' + format(player.ascensionCounter, 0, false) + ' Seconds.\n(Real-time ' + format(player.ascensionCounterRealReal, 0, false) + ' Seconds)';
            resetInfo.style.color = 'gold';
            break;
        case 'singularity':
            currencyImage1.style.display = 'none'
            resetCurrencyGain.textContent = '';
            resetInfo.textContent = 'Are you willing to give up your laurels for a greater Challenge? The Ant God bribes you with ' + format(calculateGoldenQuarkGain(), 2, true) + ' Golden Quarks. Time: ' + format(player.singularityCounter, 0, false) + ' Seconds.';
            resetInfo.style.color = 'lightgoldenrodyellow'
    }
    DOMCacheGetOrSet('resetofferings2').textContent = '+' + format(offering)
}

export const updateAutoReset = (i: number) => {
    let value = null;
    if (i === 1) {
        value = parseFloat((DOMCacheGetOrSet('prestigeamount') as HTMLInputElement).value) || 0;
        player.prestigeamount = Math.max(value, 0);
    } else if (i === 2) {
        value = parseFloat((DOMCacheGetOrSet('transcendamount') as HTMLInputElement).value) || 0;
        player.transcendamount = Math.max(value, 0);
    } else if (i === 3) {
        value = parseFloat((DOMCacheGetOrSet('reincarnationamount') as HTMLInputElement).value) || 0;
        player.reincarnationamount = Math.max(value, 0);
    } else if (i === 4) {
        value = Math.floor(parseFloat((DOMCacheGetOrSet('ascensionAmount') as HTMLInputElement).value)) || 1;
        player.autoAscendThreshold = Math.max(value, 1);
    } else if (i === 5) {
        value = parseFloat((DOMCacheGetOrSet('autoAntSacrificeAmount') as HTMLInputElement).value) || 0;
        player.autoAntSacTimer = Math.max(value, 0);
    }
}

export const updateTesseractAutoBuyAmount = () => {
    let value = Math.floor(parseFloat((DOMCacheGetOrSet('tesseractAmount') as HTMLInputElement).value)) || 0;
    if (player.resettoggle4 === 2) { // Auto mode: PERCENTAGE
        value = Math.min(value, 100);
    }
    player.tesseractAutoBuyerAmount = Math.max(value, 0);
}

const resetAddHistoryEntry = (input: resetNames, from = 'unknown') => {
    const offeringsGiven = calculateOfferings(input);
    const isChallenge = ['enterChallenge', 'leaveChallenge'].includes(from);

    if (input === 'prestige') {
        const historyEntry: ResetHistoryEntryPrestige = {
            seconds: player.prestigecounter,
            date: Date.now(),
            offerings: offeringsGiven,
            kind: 'prestige',
            diamonds: G['prestigePointGain'].toString()
        }

        Synergism.emit('historyAdd', 'reset', historyEntry);
    } else if (input === 'transcension' || input === 'transcensionChallenge') {
        // Heuristics: transcend entries are not added when entering or leaving a challenge,
        // unless a meaningful gain in particles was made. This prevents spam when using the challenge automator.
        const historyEntry: ResetHistoryEntryTranscend = {
            seconds: player.transcendcounter,
            date: Date.now(),
            offerings: offeringsGiven,
            kind: 'transcend',
            mythos: G['transcendPointGain'].toString()
        }

        Synergism.emit('historyAdd', 'reset', historyEntry);
    } else if (input === 'reincarnation' || input === 'reincarnationChallenge') {
        // Heuristics: reincarnate entries are not added when entering or leaving a challenge,
        // unless a meaningful gain in particles was made. This prevents spam when using the challenge automator.
        if (!isChallenge || G['reincarnationPointGain'].gte(player.reincarnationPoints.div(10))) {
            const historyEntry: ResetHistoryEntryReincarnate = {
                seconds: player.reincarnationcounter,
                date: Date.now(),
                offerings: offeringsGiven,
                kind: 'reincarnate',
                particles: G['reincarnationPointGain'].toString(),
                obtainium: G['obtainiumGain']
            }

            Synergism.emit('historyAdd', 'reset', historyEntry);
        }
    } else if (input === 'ascension' || input === 'ascensionChallenge') {
        // Ascension entries will only be logged if C10 was completed.
        if (player.challengecompletions[10] > 0) {
            const corruptionMetaData = CalcCorruptionStuff();
            const historyEntry: ResetHistoryEntryAscend = {
                seconds: player.ascensionCounter,
                date: Date.now(),
                c10Completions: player.challengecompletions[10],
                usedCorruptions: player.usedCorruptions.slice(0), // shallow copy,
                corruptionScore: corruptionMetaData[3],
                wowCubes: corruptionMetaData[4],
                wowTesseracts: corruptionMetaData[5],
                wowHypercubes: corruptionMetaData[6],
                wowPlatonicCubes: corruptionMetaData[7],
                wowHepteracts: corruptionMetaData[8],
                kind: 'ascend'
            }

            // If we are _leaving_ an ascension challenge, log that too.
            if (from !== 'enterChallenge' && player.currentChallenge.ascension !== 0) {
                historyEntry.currentChallenge = player.currentChallenge.ascension;
            }

            Synergism.emit('historyAdd', 'ascend', historyEntry);
        }
    }
};

export const reset = (input: resetNames, fast = false, from = 'unknown') => {
    // Handle adding history entries before actually resetting data, to ensure optimal accuracy.
    resetAddHistoryEntry(input, from);

    resetofferings(input)
    resetUpgrades(1);
    player.coins = new Decimal('102');
    player.coinsThisPrestige = new Decimal('100');
    player.firstOwnedCoin = 0;
    player.firstGeneratedCoin = new Decimal('0');
    player.firstCostCoin = new Decimal('100');
    player.secondOwnedCoin = 0;
    player.secondGeneratedCoin = new Decimal('0');
    player.secondCostCoin = new Decimal('2e3');
    player.thirdOwnedCoin = 0;
    player.thirdGeneratedCoin = new Decimal('0');
    player.thirdCostCoin = new Decimal('4e4');
    player.fourthOwnedCoin = 0;
    player.fourthGeneratedCoin = new Decimal('0');
    player.fourthCostCoin = new Decimal('8e5');
    player.fifthOwnedCoin = 0;
    player.fifthGeneratedCoin = new Decimal('0');
    player.fifthCostCoin = new Decimal('1.6e7');
    player.firstGeneratedDiamonds = new Decimal('0');
    player.secondGeneratedDiamonds = new Decimal('0');
    player.thirdGeneratedDiamonds = new Decimal('0');
    player.fourthGeneratedDiamonds = new Decimal('0');
    player.fifthGeneratedDiamonds = new Decimal('0');
    player.multiplierCost = new Decimal('1e5');
    player.multiplierBought = 0;
    player.acceleratorCost = new Decimal('500');
    player.acceleratorBought = 0;

    player.prestigeCount += 1;

    player.prestigePoints = player.prestigePoints.add(G['prestigePointGain']);
    player.prestigeShards = new Decimal('0');
    player.prestigenoaccelerator = true;
    player.prestigenomultiplier = true;
    player.prestigenocoinupgrades = true;

    player.unlocks.prestige = true;

    if (player.prestigecounter < player.fastestprestige) {
        player.fastestprestige = player.prestigecounter;
    }

    G['prestigePointGain'] = new Decimal('0');

    player.prestigecounter = 0;
    G['autoResetTimers'].prestige = 0;

    const types = ['transcension', 'transcensionChallenge', 'reincarnation', 'reincarnationChallenge', 'ascension', 'ascensionChallenge'];
    if (types.includes(input)) {
        resetUpgrades(2);
        player.coinsThisTranscension = new Decimal('100');
        player.firstOwnedDiamonds = 0;
        player.firstCostDiamonds = new Decimal('100');
        player.secondOwnedDiamonds = 0;
        player.secondCostDiamonds = new Decimal('1e5');
        player.thirdOwnedDiamonds = 0;
        player.thirdCostDiamonds = new Decimal('1e15');
        player.fourthOwnedDiamonds = 0;
        player.fourthCostDiamonds = new Decimal('1e40');
        player.fifthOwnedDiamonds = 0;
        player.fifthCostDiamonds = new Decimal('1e100');
        player.firstGeneratedMythos = new Decimal('0');
        player.secondGeneratedMythos = new Decimal('0');
        player.thirdGeneratedMythos = new Decimal('0');
        player.fourthGeneratedMythos = new Decimal('0');
        player.fifthGeneratedMythos = new Decimal('0');
        player.acceleratorBoostBought = 0;
        player.acceleratorBoostCost = new Decimal('1e3');

        player.transcendCount += 1;

        player.prestigePoints = new Decimal('0');
        player.transcendPoints = player.transcendPoints.add(G['transcendPointGain']);
        player.transcendShards = new Decimal('0');
        player.transcendnocoinupgrades = true;
        player.transcendnocoinorprestigeupgrades = true;
        player.transcendnoaccelerator = true;
        player.transcendnomultiplier = true;

        G['transcendPointGain'] = new Decimal('0')

        if (player.achievements[78] > 0.5) {
            player.firstOwnedDiamonds += 1
        }
        if (player.achievements[85] > 0.5) {
            player.secondOwnedDiamonds += 1
        }
        if (player.achievements[92] > 0.5) {
            player.thirdOwnedDiamonds += 1
        }
        if (player.achievements[99] > 0.5) {
            player.fourthOwnedDiamonds += 1
        }
        if (player.achievements[106] > 0.5) {
            player.fifthOwnedDiamonds += 1
        }

        if (player.achievements[4] > 0.5) {
            player.upgrades[81] = 1
        }
        if (player.achievements[11] > 0.5) {
            player.upgrades[82] = 1
        }
        if (player.achievements[18] > 0.5) {
            player.upgrades[83] = 1
        }
        if (player.achievements[25] > 0.5) {
            player.upgrades[84] = 1
        }
        if (player.achievements[32] > 0.5) {
            player.upgrades[85] = 1
        }
        if (player.achievements[80] > 0.5) {
            player.upgrades[87] = 1
        }

        if (player.transcendcounter < player.fastesttranscend && player.currentChallenge.transcension === 0) {
            player.fastesttranscend = player.transcendcounter;
        }

        player.transcendcounter = 0;
        G['autoResetTimers'].transcension = 0;
    }

    if (input == 'reincarnation' || input == 'reincarnationChallenge') {
        if (player.usedCorruptions[6] > 10 && player.platonicUpgrades[11] > 0) {
            player.prestigePoints = player.prestigePoints.add(G['reincarnationPointGain'])
        }
    }

    if (input === 'reincarnation' || input === 'reincarnationChallenge' || input === 'ascension' || input === 'ascensionChallenge' || input == 'singularity') {
        // Fail safe if for some reason ascension achievement isn't awarded. hacky solution but am too tired to fix right now
        if (player.ascensionCount > 0 && player.achievements[183] < 1) {
            ascensionAchievementCheck(1);
        }

        player.researchPoints += Math.floor(G['obtainiumGain']);

        const opscheck = G['obtainiumGain'] / (1 + player.reincarnationcounter)
        if (opscheck > player.obtainiumpersecond) {
            player.obtainiumpersecond = opscheck
        }
        player.currentChallenge.transcension = 0;
        resetUpgrades(3);
        player.coinsThisReincarnation = new Decimal('100');
        player.firstOwnedMythos = 0;
        player.firstCostMythos = new Decimal('1');
        player.secondOwnedMythos = 0;
        player.secondCostMythos = new Decimal('1e2');
        player.thirdOwnedMythos = 0;
        player.thirdCostMythos = new Decimal('1e4');
        player.fourthOwnedMythos = 0;
        player.fourthCostMythos = new Decimal('1e8');
        player.fifthOwnedMythos = 0;
        player.fifthCostMythos = new Decimal('1e16');
        player.firstGeneratedParticles = new Decimal('0');
        player.secondGeneratedParticles = new Decimal('0');
        player.thirdGeneratedParticles = new Decimal('0');
        player.fourthGeneratedParticles = new Decimal('0');
        player.fifthGeneratedParticles = new Decimal('0');

        player.reincarnationCount += 1;

        player.transcendPoints = new Decimal('0');
        player.reincarnationPoints = player.reincarnationPoints.add(G['reincarnationPointGain']);
        player.reincarnationShards = new Decimal('0');
        player.challengecompletions[1] = 0;
        player.challengecompletions[2] = 0;
        player.challengecompletions[3] = 0;
        player.challengecompletions[4] = 0;
        player.challengecompletions[5] = 0;

        G['reincarnationPointGain'] = new Decimal('0');

        if (player.shopUpgrades.instantChallenge > 0 && player.currentChallenge.reincarnation === 0) {
            player.challengecompletions[1] = player.highestchallengecompletions[1]
            player.challengecompletions[2] = player.highestchallengecompletions[2]
            player.challengecompletions[3] = player.highestchallengecompletions[3]
            player.challengecompletions[4] = player.highestchallengecompletions[4]
            player.challengecompletions[5] = player.highestchallengecompletions[5]

        }

        player.reincarnatenocoinupgrades = true;
        player.reincarnatenocoinorprestigeupgrades = true;
        player.reincarnatenocoinprestigeortranscendupgrades = true;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = true;
        player.reincarnatenoaccelerator = true;
        player.reincarnatenomultiplier = true;

        if (player.reincarnationcounter < player.fastestreincarnate && player.currentChallenge.reincarnation === 0) {
            player.fastestreincarnate = player.reincarnationcounter;
        }

        calculateCubeBlessings();
        player.reincarnationcounter = 0;
        G['autoResetTimers'].reincarnation = 0;

        if (player.autoResearchToggle && player.autoResearch > 0.5) {
            const linGrowth = (player.autoResearch === 200) ? 0.01 : 0;
            buyResearch(player.autoResearch, true, linGrowth)
        }

        calculateRuneLevels();
        calculateAnts();
    }

    if (input === 'ascension' || input === 'ascensionChallenge' || input === 'singularity') {
        const metaData = CalcCorruptionStuff()
        ascensionAchievementCheck(3, metaData[3])
        // reset auto challenges
        player.currentChallenge.transcension = 0;
        player.currentChallenge.reincarnation = 0;
        player.autoChallengeIndex = 1;
        toggleAutoChallengeModeText('START');
        G['autoChallengeTimerIncrement'] = 0;
        //reset rest
        resetResearches();
        resetAnts();
        resetTalismans();
        player.reincarnationPoints = new Decimal('0');
        player.reincarnationShards = new Decimal('0');
        player.obtainiumpersecond = 0;
        player.maxobtainiumpersecond = 0;
        player.offeringpersecond = 0;
        player.antSacrificePoints = 0;
        player.antSacrificeTimer = 0;
        player.antSacrificeTimerReal = 0;
        player.antUpgrades[12-1] = 0;
        for (let j = 61; j <= 80; j++) {
            player.upgrades[j] = 0;
        }
        for (let j = 94; j <= 100; j++) {
            player.upgrades[j] = 0;
        }
        player.firstOwnedParticles = 0;
        player.secondOwnedParticles = 0;
        player.thirdOwnedParticles = 0;
        player.fourthOwnedParticles = 0;
        player.fifthOwnedParticles = 0;
        player.firstCostParticles = new Decimal('1');
        player.secondCostParticles = new Decimal('100');
        player.thirdCostParticles = new Decimal('1e4');
        player.fourthCostParticles = new Decimal('1e8');
        player.fifthCostParticles = new Decimal('1e16');
        player.runeexp = [0, 0, 0, 0, 0, player.runeexp[5], player.runeexp[6]];
        player.runelevels = [0, 0, 0, 0, 0, player.runelevels[5], player.runelevels[6]];
        player.runeshards = 0;
        player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0];

        player.runelevels[0] = 3 * player.cubeUpgrades[26];
        player.runelevels[1] = 3 * player.cubeUpgrades[26];
        player.runelevels[2] = 3 * player.cubeUpgrades[26];
        player.runelevels[3] = 3 * player.cubeUpgrades[26];
        player.runelevels[4] = 3 * player.cubeUpgrades[26];

        if (player.cubeUpgrades[27] === 1) {
            player.firstOwnedParticles = 1;
            player.secondOwnedParticles = 1;
            player.thirdOwnedParticles = 1;
            player.fourthOwnedParticles = 1;
            player.fifthOwnedParticles = 1;
        }

        if (player.cubeUpgrades[48] > 0) {
            player.firstOwnedAnts += 1
        }
        if (player.challengecompletions[10] > 0) {
            player.ascensionCount += calcAscensionCount();
            player.wowCubes.add(metaData[4]); //Metadata is defined up in the top of the (i > 3.5) case
            player.wowTesseracts.add(metaData[5]);
            player.wowHypercubes.add(metaData[6]);
            player.wowPlatonicCubes.add(metaData[7]);
            player.wowAbyssals += metaData[8];
        }

        for (let j = 1; j <= 10; j++) {
            player.challengecompletions[j] = 0;
            player.highestchallengecompletions[j] = 0;
        }

        player.challengecompletions[6] = player.highestchallengecompletions[6] = player.cubeUpgrades[49]
        player.challengecompletions[7] = player.highestchallengecompletions[7] = player.cubeUpgrades[49]
        player.challengecompletions[8] = player.highestchallengecompletions[8] = player.cubeUpgrades[49]

        DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba');
        player.roombaResearchIndex = 0;
        player.autoResearch = 1;

        for (let j = 1; j <= (200); j++) {
            const k = `res${j}`;
            if (player.researches[j] > 0.5 && player.researches[j] < G['researchMaxLevels'][j]) {
                updateClassList(k, ['researchPurchased'], ['researchAvailable', 'researchMaxed', 'researchPurchasedAvailable', 'researchUnpurchased'])
            } else if (player.researches[j] > 0.5 && player.researches[j] >= G['researchMaxLevels'][j]) {
                updateClassList(k, ['researchMaxed'], ['researchAvailable', 'researchPurchased', 'researchPurchasedAvailable', 'researchUnpurchased'])
            } else {
                updateClassList(k, ['researchUnpurchased'], ['researchAvailable', 'researchPurchased', 'researchPurchasedAvailable', 'researchMaxed'])
            }
        }

        calculateAnts();
        calculateRuneLevels();
        calculateAntSacrificeELO();
        calculateTalismanEffects();
        calculateObtainium();
        ascensionAchievementCheck(1);

        player.ascensionCounter = 0;
        player.ascensionCounterReal = 0;
        player.ascensionCounterRealReal = 0;

        updateTalismanInventory();
        updateTalismanAppearance(0);
        updateTalismanAppearance(1);
        updateTalismanAppearance(2);
        updateTalismanAppearance(3);
        updateTalismanAppearance(4);
        updateTalismanAppearance(5);
        updateTalismanAppearance(6);
        calculateCubeBlessings();
        calculateTesseractBlessings();
        calculateHypercubeBlessings();

        if (player.cubeUpgrades[4] === 1) {
            player.upgrades[94] = 1;
            player.upgrades[95] = 1;
            player.upgrades[96] = 1;
            player.upgrades[97] = 1;
            player.upgrades[98] = 1;
        }
        if (player.cubeUpgrades[5] === 1) {
            player.upgrades[99] = 1;
        }
        if (player.cubeUpgrades[6] === 1) {
            player.upgrades[100] = 1
        }

        for (let j = 61; j <= 80; j++) {
            DOMCacheGetOrSet('upg' + j).style.backgroundColor = 'black'
        }
        for (let j = 94; j <= 100; j++) {
            if (player.upgrades[j] === 0) {
                DOMCacheGetOrSet('upg' + j).style.backgroundColor = 'black'
            }
        }

        const maxLevel = maxCorruptionLevel();
        player.usedCorruptions = player.prototypeCorruptions.map((curr:number, index:number) => {
            if (index >= 2 && index <= 9) {
                return Math.min(maxLevel * (player.challengecompletions[corrChallengeMinimum(index)] > 0 ? 1: 0), curr)
            }
            return curr
        })
        player.usedCorruptions[1] = 0;
        player.prototypeCorruptions[1] = 0;
        //fix c15 ascension bug by restoring the corruptions if the player ascended instead of leaving
        if (player.currentChallenge.ascension === 15 && input === 'ascension') {
            player.usedCorruptions[0] = 0;
            player.prototypeCorruptions[0] = 0;
            for (let i = 2; i <= 9; i++) {
                player.usedCorruptions[i] = 11;
            }
        }

        corruptionStatsUpdate();
        updateSingularityMilestoneAwards(false);
    }

    if (input === 'ascension' || input === 'ascensionChallenge') {
        const autoHepteractCrafts = getAutoHepteractCrafts();
        const numberOfAutoCraftsAndOrbs = autoHepteractCrafts.length + (player.overfluxOrbsAutoBuy ? 1 : 0);
        if (numberOfAutoCraftsAndOrbs > 0) {
            // Computes the max number of Hepteracts to spend on each auto Hepteract craft
            const heptAutoSpend = Math.floor((player.wowAbyssals / numberOfAutoCraftsAndOrbs) * (player.hepteractAutoCraftPercentage / 100))
            for (const craft of autoHepteractCrafts) {
                craft.autoCraft(heptAutoSpend);
            }

            if (player.overfluxOrbsAutoBuy) {
                const orbsAmount = Math.floor(heptAutoSpend / 250000);
                player.overfluxOrbs += orbsAmount;
                player.wowAbyssals -= 250000 * orbsAmount;
            }
        }

        //Autobuy tesseract buildings (Mode: PERCENTAGE)
        if (player.researches[190] > 0 && player.tesseractAutoBuyerToggle === 1 && player.resettoggle4 === 2) {
            const ownedBuildings: TesseractBuildings = [null, null, null, null, null];
            for (let i = 1; i <= 5; i++) {
                if (player.autoTesseracts[i]) {
                    ownedBuildings[i-1] = player[`ascendBuilding${i as OneToFive}` as const]['owned'];
                }
            }
            const percentageToSpend = 100 - Math.min(100, player.tesseractAutoBuyerAmount);
            const budget = Number(player.wowTesseracts) * percentageToSpend / 100;
            const buyToBuildings = calculateTessBuildingsInBudget(ownedBuildings, budget);
            // Prioritise buying buildings from highest tier to lowest,
            // in case there are any off-by-ones or floating point errors.
            for (let i = 5; i >= 1; i--) {
                const buyFrom = ownedBuildings[i-1];
                const buyTo = buyToBuildings[i-1];
                if (buyFrom !== null && buyTo !== null && buyTo !== buyFrom) {
                    buyTesseractBuilding(i as OneToFive, buyTo - buyFrom);
                }
            }
        }
    }

    //Always unlocks
    player.unlocks.prestige = true

    if (input == 'transcension' || input == 'transcensionChallenge') {
        player.unlocks.transcend = true
    }
    if (input == 'reincarnation' || input == 'reincarnationChallenge') {
        player.unlocks.reincarnate = true
    }

    if (input === 'singularity') {
        player.unlocks.coinone = false
        player.unlocks.cointwo = false
        player.unlocks.cointhree = false
        player.unlocks.coinfour = false
        player.unlocks.generation = false
        player.unlocks.prestige = false
        player.unlocks.transcend = false
        player.unlocks.reincarnate = false
        player.unlocks.rrow1 = false
        player.unlocks.rrow2 = false
        player.unlocks.rrow3 = false
        player.unlocks.rrow4 = false

        player.ascendBuilding1.owned = 0
        player.ascendBuilding2.generated = new Decimal('0')
        player.ascendBuilding2.owned = 0
        player.ascendBuilding2.generated = new Decimal('0')
        player.ascendBuilding3.owned = 0
        player.ascendBuilding3.generated = new Decimal('0')
        player.ascendBuilding4.owned = 0
        player.ascendBuilding4.generated = new Decimal('0')
        player.ascendBuilding5.owned = 0
        player.ascendBuilding5.generated = new Decimal('0')

        player.constantUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        player.wowCubes = new WowCubes(0)
        player.wowTesseracts = new WowCubes(0)
        player.wowHypercubes = new WowCubes(0)
        player.wowTesseracts = new WowCubes(0)
        player.wowAbyssals = 0;

        for (let index = 1; index <= 50; index++) {
            player.cubeUpgrades[index] = 0;
        }

        player
    }

    if (!fast) {
        revealStuff();
        updateChallengeDisplay();
    }
}

/**
 *
 * Computes which achievements in 274-280 are achievable given current singularity number
 */
export const updateSingularityAchievements = (): void => {
    if (player.singularityCount >= 1) {
        achievementaward(274)
    }
    if (player.singularityCount >= 2) {
        achievementaward(275)
    }
    if (player.singularityCount >= 3) {
        achievementaward(276)
    }
    if (player.singularityCount >= 4) {
        achievementaward(277)
    }
    if (player.singularityCount >= 5) {
        achievementaward(278)
    }
    if (player.singularityCount >= 7) {
        achievementaward(279)
    }
    if (player.singularityCount >= 10) {
        achievementaward(280)
    }
}

export const updateSingularityMilestoneAwards = (singularityReset = true): void => {
    // 1 transcension, 1001 mythos
    if (player.achievements[275] > 0) { // Singularity 2
        player.prestigeCount = 1;
        player.transcendCount = 1;
        player.transcendPoints = new Decimal('1001');

        player.unlocks.coinone = true;
        player.unlocks.cointwo = true;
        player.unlocks.cointhree = true;
        player.unlocks.coinfour = true;
        player.unlocks.prestige = true;
        player.unlocks.generation = true;
        player.unlocks.transcend = true;
        for (let i = 0; i < 5; i++){
            achievementaward(4 + 7 * i)
        }
        achievementaward(36); // 1 prestige
        achievementaward(43); // 1 transcension
    }
    if (player.achievements[276] > 0) { // Singularity 3
        if (player.currentChallenge.ascension !== 12) {
            player.reincarnationCount = 1;
            player.reincarnationPoints = new Decimal('10');
        }
        player.unlocks.reincarnate = true;
        player.unlocks.rrow1 = true;
        player.researches[47] = 1;

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 5; j++) {
                achievementaward(78 + i + 7 * j)
            }
        }

        for (let i = 0; i < 7; i++) {
            achievementaward(57 + i);
            achievementaward(64 + i);
            achievementaward(71 + i);
        }

        achievementaward(37)
        achievementaward(38)
        achievementaward(44)
        achievementaward(50)
        achievementaward(80)
        achievementaward(87)

    }
    if (player.achievements[277] > 0) { // Singularity 4
        if (player.currentChallenge.ascension !== 14) {
            player.researchPoints = Math.floor(500 * calculateSingularityDebuff('Offering') * calculateSingularityDebuff('Researches'))
        }
        if (player.currentChallenge.ascension !== 12) {
            player.reincarnationPoints = new Decimal('1e16')
        }
        player.challengecompletions[6] = 1;
        player.highestchallengecompletions[6] = 1;
        achievementaward(113);
    }
    if (player.achievements[278] > 0 && singularityReset) { // Singularity 5
        player.shopUpgrades.offeringAuto = 10
        player.shopUpgrades.offeringEX = 10
        player.shopUpgrades.obtainiumAuto = 10
        player.shopUpgrades.obtainiumEX = 10
        player.shopUpgrades.antSpeed = 10
        player.shopUpgrades.cashGrab = 10
        player.cubeUpgrades[7] = 1;
    }
    if (player.achievements[279] > 0) { // Singularity 7
        player.challengecompletions[7] = 1;
        player.highestchallengecompletions[7] = 1;
        achievementaward(120);
        if (player.currentChallenge.ascension !== 12) {
            player.reincarnationPoints = new Decimal('1e100');
        }
    }
    if (player.achievements[280] > 0) { // Singularity 10
        achievementaward(127);
        player.challengecompletions[8] = 1;
        player.highestchallengecompletions[8] = 1;
        player.cubeUpgrades[8] = 1;
        player.cubeUpgrades[4] = 1; // Adding these ones,
        player.cubeUpgrades[5] = 1; // so they wont reset
        player.cubeUpgrades[6] = 1; // on first Ascension
        player.firstOwnedAnts = 1;
        for (let i = 0; i < 7; i++) {
            achievementaward(176 + i)
        }
    }
    if (player.singularityCount > 10) { // Must be the same as autoResearchEnabled()
        player.cubeUpgrades[9] = 1;
    }
    if (player.singularityCount >= 15) {
        player.challengecompletions[8] = 5;
        player.highestchallengecompletions[8] = 5;
        if (player.currentChallenge.ascension !== 12) {
            player.reincarnationPoints = new Decimal('2.22e2222')
        }
        player.fifthOwnedAnts = 1;
        player.cubeUpgrades[20] = 1;
    }
    if (player.singularityCount >= 20) {
        player.challengecompletions[9] = 1;
        player.highestchallengecompletions[9] = 1;
        achievementaward(134);
        player.antPoints = new Decimal('1e100');
        player.antUpgrades[11] = 1;
        player.shopUpgrades.offeringAuto = shopData.offeringAuto.maxLevel
        player.shopUpgrades.offeringEX = shopData.offeringEX.maxLevel
        player.shopUpgrades.obtainiumAuto = shopData.obtainiumAuto.maxLevel
        player.shopUpgrades.obtainiumEX = shopData.obtainiumEX.maxLevel
        player.shopUpgrades.antSpeed = shopData.antSpeed.maxLevel
        player.shopUpgrades.cashGrab = shopData.cashGrab.maxLevel
    }
    if (player.singularityCount >= 25) {
        player.eighthOwnedAnts = 1;
    }
    if (player.singularityCount >= 30) {
        player.researches[130] = 1;
        player.researches[135] = 1;
        player.researches[145] = 1;
    }

    resetUpgrades(3);
    for (let j = 1; j < player.cubeUpgrades.length; j++) {
        updateCubeUpgradeBG(j);
    }
    for (let j = 1; j < player.researches.length; j++) {
        if (player.researches[j] > 0) {
            updateResearchBG(j);
        }
    }
    revealStuff();
}

export const singularity = async (): Promise<void> => {
    if (player.runelevels[6] === 0) {
        return Alert('You nearly triggered a double singularity bug! Oh no! Luckily, our staff prevented this from happening.');
    }

    // reset the rune instantly to hopefully prevent a double singularity
    player.runelevels[6] = 0;
    player.goldenQuarks += calculateGoldenQuarkGain();
    player.singularityCount += 1;
    player.totalQuarksEver += player.quarksThisSingularity;
    await resetShopUpgrades(true);
    const hold = Object.assign({}, blankSave, {
        codes: Array.from(blankSave.codes)
    }) as Player;
    //Reset Displays
    toggleTabs('buildings');
    toggleSubTab(1, 0);
    toggleSubTab(4, 0); // Set 'runes' subtab back to 'runes' tab
    toggleSubTab(8, 0); // Set 'cube tribues' subtab back to 'cubes' tab
    toggleSubTab(9, 0); // set 'corruption main'
    toggleSubTab(-1, 0); // set 'statistics main'

    hold.totalQuarksEver = player.totalQuarksEver
    hold.singularityCount = player.singularityCount;
    hold.goldenQuarks = player.goldenQuarks;
    hold.shopUpgrades = player.shopUpgrades;
    hold.worlds = new QuarkHandler({ quarks: 0, bonus: 0 })
    hold.singularityUpgrades = player.singularityUpgrades
    hold.autoChallengeToggles = player.autoChallengeToggles
    hold.autoChallengeTimer = player.autoChallengeTimer
    hold.saveString = player.saveString
    hold.corruptionLoadouts = player.corruptionLoadouts
    hold.corruptionLoadoutNames = player.corruptionLoadoutNames
    hold.corruptionShowStats = player.corruptionShowStats
    hold.toggles = player.toggles
    hold.retrychallenges = player.retrychallenges
    hold.resettoggle1 = player.resettoggle1
    hold.resettoggle2 = player.resettoggle2
    hold.resettoggle3 = player.resettoggle3
    hold.resettoggle4 = player.resettoggle4
    hold.coinbuyamount = player.coinbuyamount
    hold.crystalbuyamount = player.crystalbuyamount
    hold.mythosbuyamount = player.mythosbuyamount
    hold.particlebuyamount = player.particlebuyamount
    hold.offeringbuyamount = player.offeringbuyamount
    hold.tesseractbuyamount = player.tesseractbuyamount
    hold.shoptoggles = player.shoptoggles
    hold.autoSacrificeToggle = player.autoSacrificeToggle
    hold.autoBuyFragment = player.autoBuyFragment
    hold.autoFortifyToggle = player.autoFortifyToggle
    hold.autoEnhanceToggle = player.autoEnhanceToggle
    hold.autoResearchToggle = player.autoResearchToggle
    hold.autoResearchMode = player.autoResearchMode
    hold.dailyCodeUsed = player.dailyCodeUsed
    hold.runeBlessingBuyAmount = player.runeBlessingBuyAmount
    hold.runeSpiritBuyAmount = player.runeSpiritBuyAmount
    hold.prestigeamount = player.prestigeamount
    hold.transcendamount = player.transcendamount
    hold.reincarnationamount = player.reincarnationamount
    hold.talismanOne = player.talismanOne
    hold.talismanTwo = player.talismanTwo
    hold.talismanThree = player.talismanThree
    hold.talismanFour = player.talismanFour
    hold.talismanFive = player.talismanFive
    hold.talismanSix = player.talismanSix
    hold.talismanSeven = player.talismanSeven
    hold.antMax = player.antMax
    hold.autoAntSacrifice = player.autoAntSacrifice
    hold.autoAntSacrificeMode = player.autoAntSacrificeMode
    hold.autoAntSacTimer = player.autoAntSacTimer
    hold.autoAscend = player.autoAscend
    hold.autoAscendMode = player.autoAscendMode
    hold.autoAscendThreshold = player.autoAscendThreshold
    hold.autoResearch = 0
    hold.autoTesseracts = player.autoTesseracts
    hold.tesseractAutoBuyerToggle = player.tesseractAutoBuyerToggle
    hold.tesseractAutoBuyerAmount = player.tesseractAutoBuyerAmount
    hold.historyShowPerSecond = player.historyShowPerSecond
    hold.exporttest = player.exporttest
    hold.dayTimer = player.dayTimer
    hold.dayCheck = player.dayCheck
    hold.ascStatToggles = player.ascStatToggles
    hold.hepteractAutoCraftPercentage = player.hepteractAutoCraftPercentage
    hold.shopBuyMaxToggle = player.shopBuyMaxToggle
    hold.shopHideToggle = player.shopHideToggle
    hold.shopConfirmationToggle = player.shopConfirmationToggle
    hold.researchBuyMaxToggle = player.researchBuyMaxToggle
    hold.cubeUpgradesBuyMaxToggle = player.cubeUpgradesBuyMaxToggle

    // Quark Hepteract craft is saved entirely. For other crafts we only save their auto setting
    hold.hepteractCrafts.quark = player.hepteractCrafts.quark;
    for (const craftName of Object.keys(player.hepteractCrafts)) {
        if (craftName !== 'quark') {
            const craftKey = craftName as keyof Player['hepteractCrafts'];
            hold.hepteractCrafts[craftKey].AUTO = player.hepteractCrafts[craftKey].AUTO;
        }
    }

    //Import Game
    await importSynergism(btoa(JSON.stringify(hold)), true);

    player.codes.set(39, true);
    player.codes.set(40, true);
    player.codes.set(41, true);
    updateSingularityMilestoneAwards();
}

const resetUpgrades = (i: number) => {
    if (i > 2.5) {
        for (let i = 41; i < 61; i++) {
            if (i !== 46) {
                player.upgrades[i] = 0;
            }
        }

        if (player.researches[41] === 0) {
            player.upgrades[46] = 0;
        }

        if (player.researches[41] < 0.5) {
            player.upgrades[88] = 0;
        }
        if (player.achievements[50] === 0) {
            player.upgrades[89] = 0;
        }
        if (player.researches[42] < 0.5) {
            player.upgrades[90] = 0;
        }
        if (player.researches[43] < 0.5) {
            player.upgrades[91] = 0;
        }
        if (player.researches[44] < 0.5) {
            player.upgrades[92] = 0;
        }
        if (player.researches[45] < 0.5) {
            player.upgrades[93] = 0;
        }

        player.upgrades[116] = 0;
        player.upgrades[117] = 0;
        player.upgrades[118] = 0;
        player.upgrades[119] = 0;
        player.upgrades[120] = 0;
    }

    for (let j = 1; j <= 20; j++) {
        player.upgrades[j] = 0;
    }

    // both indices go up by 5, so we can put them together!
    for (let j = 121, k = 106; j <= 125; j++, k++) {
        player.upgrades[j] = 0;
        player.upgrades[k] = 0;
    }

    if (i > 1.5) {
        if (player.achievements[4] < 0.5) {
            player.upgrades[81] = 0;
        }
        if (player.achievements[11] < 0.5) {
            player.upgrades[82] = 0;
        }
        if (player.achievements[18] < 0.5) {
            player.upgrades[83] = 0;
        }
        if (player.achievements[25] < 0.5) {
            player.upgrades[84] = 0;
        }
        if (player.achievements[32] < 0.5) {
            player.upgrades[85] = 0;
        }
        if (player.achievements[87] < 0.5) {
            player.upgrades[86] = 0;
        }
        if (player.achievements[80] < 0.5) {
            player.upgrades[87] = 0;
        }


        player.upgrades[101] = 0;
        player.upgrades[102] = 0;
        player.upgrades[103] = 0;
        player.upgrades[104] = 0;
        player.upgrades[105] = 0;


    }

    if (i > 1.5) {
        for (let k = 21; k < 41; k++) {
            player.upgrades[k] = 0;
        }

        player.upgrades[111] = 0;
        player.upgrades[112] = 0;
        player.upgrades[113] = 0;
        player.upgrades[114] = 0;
        player.upgrades[115] = 0;
    }

    if (i > 1.5) {
        player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
        player.crystalUpgradesCost = [7, 15, 20, 40, 100, 200, 500, 1000]

        let m = 0;
        m += Math.floor(G['rune3level'] * G['effectiveLevelMult'] / 16) * 100 / 100
        if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
            m += 10
        }
        player.crystalUpgrades = [m, m, m, m, m, m, m, m]
    }

    for (let x = 1; x <= 125; x++) {
        upgradeupdate(x, true)
    }
    if (player.achievements[87] > 0.5) {
        player.upgrades[86] = 1
    }
}

export const resetAnts = () => {
    player.firstOwnedAnts = 0;
    if (player.cubeUpgrades[48] > 0) {
        player.firstOwnedAnts = 1
    }

    player.secondOwnedAnts = 0;
    player.thirdOwnedAnts = 0;
    player.fourthOwnedAnts = 0;
    player.fifthOwnedAnts = 0;
    player.sixthOwnedAnts = 0;
    player.seventhOwnedAnts = 0;
    player.eighthOwnedAnts = 0;

    player.firstGeneratedAnts = new Decimal('0');
    player.secondGeneratedAnts = new Decimal('0');
    player.thirdGeneratedAnts = new Decimal('0');
    player.fourthGeneratedAnts = new Decimal('0');
    player.fifthGeneratedAnts = new Decimal('0');
    player.sixthGeneratedAnts = new Decimal('0');
    player.seventhGeneratedAnts = new Decimal('0');
    player.eighthGeneratedAnts = new Decimal('0');

    player.firstCostAnts = new Decimal('1e700');
    player.secondCostAnts = new Decimal('3');
    player.thirdCostAnts = new Decimal('100');
    player.fourthCostAnts = new Decimal('1e4');
    player.fifthCostAnts = new Decimal('1e12');
    player.sixthCostAnts = new Decimal('1e36');
    player.seventhCostAnts = new Decimal('1e100');
    player.eighthCostAnts = new Decimal('1e300');

    const ant12 = player.antUpgrades[12-1];
    player.antUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ant12];
    player.antPoints = new Decimal('1');

    if (player.currentChallenge.ascension === 12) {
        player.antPoints = new Decimal('7')
    }

    calculateAnts();
    calculateRuneLevels();
}

const resetResearches = () => {
    player.researchPoints = 0;
    //Array listing all the research indexes deserving of removal
    const destroy = [
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        76, 81, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 97, 98,
        101, 102, 103, 104, 106, 107, 108, 109, 110, 116, 117, 118, 121, 122, 123,
        126, 127, 128, 129, 131, 132, 133, 134, 136, 137, 138, 139, 141, 142, 143, 144, 146, 147, 148, 149,
        151, 152, 153, 154, 156, 157, 158, 159, 161, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174,
        176, 177, 178, 179, 181, 182, 183, 184, 186, 187, 188, 189, 191, 192, 193, 194, 196, 197, 198, 199
    ];

    for (const item of destroy) {
        player.researches[item] = 0;
    }
}

const resetTalismans = () => {
    player.talismanLevels = [0, 0, 0, 0, 0, 0, 0];
    player.talismanRarity = [1, 1, 1, 1, 1, 1, 1];

    player.talismanShards = 0;
    player.commonFragments = 0;
    player.uncommonFragments = 0;
    player.rareFragments = 0;
    player.epicFragments = 0;
    player.legendaryFragments = 0;
    player.mythicalFragments = 0;
}
