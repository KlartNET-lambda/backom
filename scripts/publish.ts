import type { PublishResult } from "./@types/publish.js";
import { publish } from 'gh-pages';
const options = ["./dist", {
	branch: 'dist',
	message: "자동 업데이트 및 배포"
}];

const error: PublishResult = await publish(...options);
if(error) throw error;
console.log("성공적으로 GitHub Pages에 배포되었습니다!");