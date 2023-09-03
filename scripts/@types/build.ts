const TYPES = ["PUBLISH", "TEST"] as const;

export type BuildTypes = typeof TYPES[number];
export type BuildTypingResult = {
	readonly [type in BuildTypes]: boolean;
};


export const buildTyping = (buildArgv: BuildTypes): BuildTypingResult => {
	if(!TYPES.includes(buildArgv)) {
		if(!buildArgv?.length) throw new TypeError("빌드 타입을 지정해주세요.");
		throw new TypeError(`"${buildArgv}"은(는) 올바른 빌드 타입이 아닙니다.`);
	} else {
		//return TYPES.reduce((acc, type) => ({ ...acc, [type]: buildArgv === type }), {} as BuildTypingResult);
		const result = {};
		for(const type of TYPES) result[type] = (buildArgv === type);
		
		return result as BuildTypingResult;
	}
};