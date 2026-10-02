const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const startString = '{/* LEADERS */}';
const endString = '{/* MOST READ */}';

const startIndex = content.indexOf(startString);
const endIndex = content.indexOf(endString);

if (startIndex > -1 && endIndex > -1) {
  const blockStart = content.lastIndexOf('\n', startIndex) + 1;
  const blockEnd = content.lastIndexOf('\n', endIndex) + 1;
  
  const replacement = `              {/* LEADERS */}
              <div className="w-full">
                <LeftCategorySection category="Leaders" />
              </div>

`;
  
  const newContent = content.substring(0, blockStart) + replacement + content.substring(blockEnd);
  
  fs.writeFileSync('src/app/page.tsx', newContent);
  console.log('Successfully replaced LEADERS block.');
} else {
  console.log('Could not find bounds for LEADERS.');
}
