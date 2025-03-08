interface Update {
  date: string;
  title?: string;
  context: string[];
  images?: string[];
}

interface ChangeLogProps {
  updates: Update[];
}

const updates: Update[] = [
  {
    date: 'May 4, 2024',
    context: ['Updated Manage Raids styling to work properly for Active, Inactive and Hover over Raid Chips and Help Text'],
  },
  {
    date: 'May 5, 2024',
    context: ['Added Basic HomePage for Updates and Communication'],
  },
  {
    date: 'May 6, 2024',
    context: ['Todo List is only temporary for fun will probably remove it later or revamp it'],
  },
  {
    date: 'May 7, 2024',
    context: ['Updated Total Gold Row in Gold Calculator to Be Visible Always on the Bottom, made it mobile friendly'],
  },
  {
    date: 'May 8, 2024',
    context: ['Removing Page Refresh when you add something to Todo List'],
  },
  {
    date: 'May 9, 2024',
    context: ['Updated Communication Text to be More User Friendly with a Timeline Instead of a List'],
  },
  {
    date: 'May 10, 2024',
    context: ['Working on Thaemine and Echnida Removal Fix, Most Likely rewriting The Raid Calculator from scratch to be more efficient and easier to maintain'],
  },
  {
    date: 'May 11, 2024',
    context: ['Added a New Row called Additional Gold to Add your own Gold to the Total Gold Calculation based on each Individual Character'],
  },
  {
    date: 'May 12, 2024',
    context: ["Fixed Issue with text cutting into Checkbox's for labels on Smaller Windows"],
  },
  {
    date: 'May 13, 2024',
    context: ['Adding Show Differences Icon on Raids instead of doing mouse hover to be more mobile friendly'],
  },
  {
    date: 'May 14, 2024',
    context: ['Updating Gold Formatting to your currency locale formatting'],
  },
  {
    date: 'May 15, 2024',
    context: ['Lined up Additional Gold with Total Gold for better readability'],
  },
  {
    date: 'May 16, 2024',
    context: ['Updated Raids Data to Include Boss Drops Upto Echnida'],
  },
  {
    date: 'May 17, 2024',
    context: ['Working on fixing totals for double boss rewards stacking on each other in raids Page'],
  },
  {
    date: 'May 18, 2024',
    context: ['Added Trash Can Icon to Clear All Data from Gold Calculator Except Raid Selections'],
  },
  {
    date: 'May 19, 2024',
    context: ['Managing Raids is now 2 columns if you have a smaller screen or width'],
  },
  {
    date: 'May 20, 2024',
    context: ['Added All Honor Shard Rewards Upto Thaemine!'],
  },
  {
    date: 'May 21, 2024',
    context: ["Added a Popup to confirm to clear data so you don't accidently delete it :)"],
  },
  {
    date: 'May 22, 2024',
    context: ['Adding Chaos Stones to Raid Grid'],
  },
  {
    date: 'May 23, 2024',
    context: ['Fixed bug that Additional Gold was Adding Twice to Total Gold.' +
      ' Fixed Removing Thaemine or Echnida Raids! If You are Having Issues please click Trash Can to Delete Data and Reset!'
    ],
  },
  {
    date: 'May 24, 2024',
    context: ['Rewrote Gold Calculator Special Key to Calculate Gold for Each Raid'],
  },
  {
    date: 'May 25, 2024',
    context: ['Fixed Thaemine and Echnida Raid Removal Issues for Gold Calculator!'],
  },
  {
    date: 'May 26, 2024',
    context: ['Adding Destruction Stones to Raid Grid, Boxs and Clears. Boss Rewards for Box and Clear are the same so they are not added twice'],
  },
  {
    date: 'May 27, 2024',
    context: ['Adding Contact Me Support for Requests and Bug Reporting! Added Raid Info for Boss Drops, Chaos Stones, Destruction Stones and tooltips.'],
  },
  {
    date: 'May 28, 2024',
    context: ['Fixed Title Tab Issues for Hard Mode for Raids Page, Added in Engraving Optimizer.' +
      ' Added Daily and Weekly Todo!!!! Chaos Gates, Una Tasks, Guardian Raids and Guild Weeklies! That automatically resets daily and weekly!'
    ],
  },
  {
    date: 'May 29, 2024',
    title: 'No More Class Engravings on Ability Stones, Discord Server Added!',
    context: ['Added someones request to add a clear all raid data for every character (reverse clock icon). ' + 
    'Made Engravings have a minimum of 3 for each and no slider for 2nd engraving. ' +
    'Class Engravings are now labeled. They cannot be self added on the ability stone anymore going forward by Users (Optimizer can pick class engravings). ' +
    'Added discord server as well. ' +
    'Added Box Purchase Option on Character Sheet!'],
  },
  {
    date: 'May 30, 2024',
    title: 'Fixed Width Issues with Engraving and Raids Page and added in Gold Costs for Accessories',
    context: ['Width sizing has been changed to not feel so wide anymore for engravings and raids page and it still fits all data for all screens properly ' +
      'Added in gold costs for accessories as well!'
    ],
  },
  {
    date: 'June 2, 2024',
    title: 'Updated Box And Raid Clear Text',
    context: ['Box and raid rewards are the same so I made the text more clear'],
  },
  {
    date: 'June 9, 2024',
    title: 'Engraving Optimizer for Ability Stone now only uses class engravings',
    context: ['Only class engravings are set for the optimizer for ability stones going forward! Negative Engravings added for ability Stone'],
  },
  {
    date: 'June 13, 2024',
    title: 'Fixed Negative Engravings',
    context: ['You can now select negative engravings for all accessories from the range of 1 to 3 that have a third engraving slot, basically everything besides books'],
  },
  {
    date: 'June 21, 2024',
    context: ['Updated Top Bar to be countdown for Tier 4!'],
  },
  {
    date: 'June 22, 2024',
    title: 'Updated Echnida Data! Saving Height between Hard and Normal Raids for same Raid',
    context: ['Added Echnida Drop Data! Your page height is saved when swapping between normal vs hard mode of the same raid so you do not have to keep scrolling'],
  },
  {
    date: 'July 17, 2024',
    title: 'Updated New Gold Data for All Raids!',
    context: ['Ivory Tower changed to 3 gates and updated raid data for all raids based on cool retreat patch notes. Updated Character Sheet and Gold Raid Data.'],
  },
  {
    date: 'August 9, 2024',
    title: 'Updated Data Support for Solo Raid Gold & Data on Website',
    context: ['Updated Hacky soloGoldData on normal Raids to actual be standalone instead. Added Solo Checkbox along with Gate Gold Costs in Character Sheet.'],
  },
  {
    date: 'August 9, 2024',
    title: 'Immediate Bug Fixes',
    context: ['Bug fixed incorrect Normal Raid Data Gold on Compare Page'],
  },
  {
    date: 'August 10, 2024',
    title: 'Added Solo Raids Support to Raids Page',
    context: ['You can now click the Ninja Icon to see Solo Raid Data on Raids Page if the Raid has it.'],
    images: ['https://i.imgur.com/e8jrGRW.png'],
  },
  {
    date: 'August 10, 2024',
    title: 'Fixed Bug where selected engravings were not working as intended',
    context: ['Now when you select Engravings you only see those engravings in your boxes for Engraving 1 and Engraving 2'],
  },
  {
    date: 'August 10, 2024',
    title: 'Fixed Critical Bug with Character Sheet Not Saving Raids',
    context: ['Now when you set your raids and refresh the page or come back they are saved'],
  },
  {
    date: 'August 10, 2024',
    title: 'Fixed Dark Fire and Spring Water Incorrect Information',
    context: ['Dark Fire and Spring Water are now swapped'],
  },
  {
    date: 'August 10, 2024',
    title: 'Added Clear Medals to All Raids that have them. Fixed Row Formatting Issues in Raid Data',
    context: ['Now when you open certain raids Voldis and below you will see clear medals for normal, hard, and solo'],
  },
  {
    date: 'August 10, 2024',
    title: 'Added Chaos Dungeon and Guardian Raids to Compare Page',
    context: ['Now you can Tab Between Gold, Chaos Dungeon and Guardian Raids to compare them all'],
  },
  {
    date: 'August 11, 2024',
    title: 'Fixed Wrong Images with Silver and Ring Item',
    context: ['Images for Silver and Ring Accessory are now correct'],
  },
  {
    date: 'August 13, 2024',
    title: 'Fixed Issue with Content Selector not selecting when Raid is Solo. Updated Box Cost Text Color for better visibility',
    context: ['Now Solo Raids link back up to the Content Selector and it remains selected when you click solo Icon'],
  },
  {
    date: 'August 13, 2024',
    title: 'Saves Hard/Solo/Normal Mode for Raids Based on the Raid',
    context: ['When you Click Hard or Solo Icon it keeps it selected and saved when you revisit the page. Sometimes will not save if you swap too fast.'],
  },
  {
    date: 'August 14, 2024',
    title: 'Updated Solo Raid Gold Data for Box and Gold Earned',
    context: ['Solo Gold Everywhere now correctly reflects bound gold'],
  },
  {
    date: 'August 24, 2024',
    title: 'Updated Tier 4 Release Date',
    context: ['Tier 4 Release Date is now October 9.'],
  },
  {
    date: 'August 24, 2024',
    title: 'Added Behemoth Raid',
    context: ['Added Behemoth Raid to Raids'],
  },
  {
    date: 'Oct 7, 2024',
    title: 'Fixed Behemoth Raid Gold Cost And Box Cost',
    context: ['Fixed Behemoth Raid Gold Cost And Box Cost'],
  },
  {
    date: 'Oct 9, 2024',
    title: 'Fixed item level requirements for guardian raids',
    context: ['Fixed item level requirements for guardian raids'],
  },
  {
    date: 'Oct 13, 2024',
    title: 'Updated all data for new patch',
    context: ['Updated all gold and rewards for new balance patch'],
  },
  {
    date: 'Oct 24, 2024',
    title: 'Updated all data for new patch',
    context: ['Fixed Akkan Hard Mode Gold. Added Argeos Drops Data. Added Chaos Gates T4. Added New Raid Aegir'],
  },
  {
    date: 'Nov 10, 2024',
    title: 'Fixed Reset Times',
    context: ['Fixed Daily/Weekly Reset Issue for Daylight Savings and Other Timezones'],
  },
  {
    date: 'Dec 20, 2024',
    title: 'Updated Chaos Gates, Extra Rewards Solo Box Costs',
    context: ['Updated Chaos Gates to be only 1 from now on. Updated All Solo Raid Box Costs with new buffs. '],
  },
  {
    date: 'Dec 21, 2024',
    title: 'Updated Solo Raids',
    context: ['Added Solo Mode for Echidna and Thaemine and clear medals. Fixed bug and reset character sheet'],
  },
  {
    date: 'Jan 24, 2025',
    title: 'Updated Raids',
    context: ['Updated gold for new patch!'],
  },
  {
    date: 'Mar 8, 2025',
    title: 'Added Bound Gold',
    context: ['Added bound gold for all raids and updated gate gold and box costs!'],
  },
].reverse();

export type { ChangeLogProps };
export default updates;
