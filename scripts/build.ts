import type { BuildOptions, BuildContext } from 'esbuild';
import type { BuildTypes } from "./@types/build";

import { build, context } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import Servor from 'servor';
import { buildTyping } from "./@types/build";

const buildArgv = process.argv.slice(2)[0] as BuildTypes;
const buildType = buildTyping(buildArgv);
const defaultOption: BuildOptions = {
	platform: 'browser',
	format: 'esm',
	target: 'esnext',

	bundle: true,
	treeShaking: true,
	minify: buildType.PUBLISH,
	sourcemap: buildType.TEST,

	entryPoints: [
		"./src/js/index.tsx",
		"./src/css/index.css"
	],
	outdir: "./dist/",
	
	plugins: [
		copy({
			assets: [{
				from: ["./src/index.html"],
				to: ['./'],
			},{
				from: ["./src/favicon.ico"],
				to: ['./'],
			}]
		}),
	]
};


if(buildType.PUBLISH) await build(defaultOption);
if(buildType.TEST) {
	await (await context(defaultOption)).watch();
	const liveServor = await Servor({
		root: "dist/",
		credentials: false,
		port: 5500,
		reload: true,
	});
	console.log(`라이브 서버가 작동 중입니다: ${liveServor.url}`);
}
console.log(`${buildArgv} - 빌드 작업이 완료되었습니다!`);