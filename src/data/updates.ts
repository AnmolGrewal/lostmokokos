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
].reverse();

export type { ChangeLogProps };
export default updates;
