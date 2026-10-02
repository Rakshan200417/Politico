const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const startString = '{/* Center Column: TECHNOLOGY, WHITE HOUSE, ECONOMY */}';
const endString = '{/* Right Column: LEADERS, MOST READ, ECONOMY, VIDEO */}';

const startIndex = content.indexOf(startString);
const endIndex = content.indexOf(endString);

if (startIndex > -1 && endIndex > -1) {
  // Find the exact line starts
  const blockStart = content.lastIndexOf('\n', startIndex) + 1;
  const blockEnd = content.lastIndexOf('\n', endIndex) + 1;
  
  const replacement = `            {/* Center Column: DYNAMIC CATEGORIES */}
            <div className="flex flex-col lg:px-6 border-l border-r border-gray-200 h-full">
              <MainCategorySection category="Technology" />
              <MainCategorySection category="Startups" />
              <MainCategorySection category="Economy" />
              <MainCategorySection category="Markets" />
              <MainCategorySection category="Industries" />
              <MainCategorySection category="Finance" />
              <MainCategorySection category="World" />
            </div>

`;
  
  const newContent = content.substring(0, blockStart) + replacement + content.substring(blockEnd);
  
  // also add import if missing
  let finalContent = newContent;
  if (!finalContent.includes('MainCategorySection')) {
    finalContent = finalContent.replace(
      'import AdvertisementSlot from "@/components/common/AdvertisementSlot";',
      'import AdvertisementSlot from "@/components/common/AdvertisementSlot";\nimport MainCategorySection from "@/components/home/MainCategorySection";'
    );
  }
  
  fs.writeFileSync('src/app/page.tsx', finalContent);
  console.log('Successfully replaced center column.');
} else {
  console.log('Could not find bounds.');
}
