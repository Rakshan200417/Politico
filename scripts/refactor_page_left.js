const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const startString = '{/* Left Column: COMPANIES + Ads */}';
const endString = '{/* Sticky Block for Left Column */}';

const startIndex = content.indexOf(startString);
const endIndex = content.indexOf(endString);

if (startIndex > -1 && endIndex > -1) {
  const blockStart = content.indexOf('\n', startIndex) + 1;
  const blockEnd = content.lastIndexOf('\n', endIndex) + 1;
  
  const replacement = `            <div className="flex flex-col space-y-8 h-full">
              <LeftCategorySection category="Companies" />
              
`;
  
  let newContent = content.substring(0, blockStart) + replacement + content.substring(blockEnd);
  
  if (!newContent.includes('LeftCategorySection')) {
    newContent = newContent.replace(
      'import MainCategorySection from "@/components/home/MainCategorySection";',
      'import MainCategorySection from "@/components/home/MainCategorySection";\nimport LeftCategorySection from "@/components/home/LeftCategorySection";'
    );
  }
  
  fs.writeFileSync('src/app/page.tsx', newContent);
  console.log('Successfully replaced Left Column.');
} else {
  console.log('Could not find bounds for Left Column.');
}
