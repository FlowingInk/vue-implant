import type { ResolvedInjectionModule } from '../../../config/type';
import type { RenderImportResult } from '../../type';

const normalizeImportPath = (value: string): string => {
	return value.replace(/\\/g, '/');
};

const sanitize = (moduleId: string): string => {
	const normalized = moduleId.replace(/[^a-zA-Z0-9_$]/g, '_');
	return /^[a-zA-Z_$]/.test(normalized) ? normalized : `_${normalized}`;
};

const createImportName = () => {
	const used = new Map<string, number>();

	return (moduleId: string): string => {
		const base = `Injection_${sanitize(moduleId)}`;
		const count = used.get(base) ?? 0;
		used.set(base, count + 1);
		return count === 0 ? base : `${base}_${count}`;
	};
};

export function renderImportComp(injections: ResolvedInjectionModule[]): RenderImportResult {
	const importName = createImportName();

	const imports = injections.map((injection) => {
		const name = importName(injection.moduleId);

		const code = `import ${name} from '${normalizeImportPath(injection.componentPath)}';`;

		return {
			moduleId: injection.moduleId,
			componentPath: injection.componentPath,
			importName: name,
			code
		};
	});

	return {
		code: imports.map((item) => item.code).join('\n'),
		importsName: imports.map((item) => item.importName)
	};
}
