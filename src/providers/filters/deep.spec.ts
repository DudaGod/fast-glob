import * as assert from 'assert';

import * as tests from '../../tests';

import DeepFilter from './deep';

import * as optionsManager from '../../managers/options';

import { FilterFunction } from '@mrmlnc/readdir-enhanced';
import { IOptions, IPartialOptions } from '../../managers/options';
import { Pattern } from '../../types/patterns';

function getDeepFilterInstance(options?: IPartialOptions): DeepFilter {
	const preparedOptions: IOptions = optionsManager.prepare(options);

	return new DeepFilter(preparedOptions, {
		dot: preparedOptions.dot
	});
}

function getFilter(positive: Pattern[], negative: Pattern[], options?: IPartialOptions): FilterFunction {
	return getDeepFilterInstance(options).getFilter(positive, negative);
}

describe('Providers → Filters → Deep', () => {
	describe('Constructor', () => {
		it('should create instance of class', () => {
			const filter = getDeepFilterInstance();

			assert.ok(filter instanceof DeepFilter);
		});
	});

	describe('.filter', () => {
		describe('Skip by nesting level', () => {
			it('should return «false» when option is disabled', () => {
				const filter = getFilter(['**/*'], [], { deep: false });

				const entry = tests.getDirectoryEntry(false /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(!actual);
			});

			it('should return «false» when option has specified level', () => {
				const filter = getFilter(['**/*'], [], { deep: 2 });

				const entry = tests.getEntry({
					path: 'fixtures/directory/directory',
					depth: 3,
					isDirectory: () => true
				});

				const actual = filter(entry);

				assert.ok(!actual);
			});

			it('should return «true» when depth is smaller than allowed', () => {
				const filter = getFilter(['fixtures/*/*'], []);

				const entry = tests.getEntry({
					path: 'fixtures/directory/directory',
					depth: 3,
					isDirectory: () => true
				});

				const actual = filter(entry);

				assert.ok(actual);
			});

			it('should return «false» when depth is greater than allowed', () => {
				const filter = getFilter(['fixtures/*'], []);

				const entry = tests.getEntry({
					path: 'fixtures/directory/directory',
					depth: 3,
					isDirectory: () => true
				});

				const actual = filter(entry);

				assert.ok(!actual);
			});
		});

		describe('Skip by «followSymlinkedDirectories» option', () => {
			it('should return «true» for symlinked directory when option is enabled', () => {
				const filter = getFilter(['**/*'], []);

				const entry = tests.getDirectoryEntry(false /** dot */, true /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(actual);
			});

			it('should return «false» for symlinked directory when option is disabled', () => {
				const filter = getFilter(['**/*'], [], { followSymlinkedDirectories: false });

				const entry = tests.getDirectoryEntry(false /** dot */, true /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(!actual);
			});
		});

		describe('Skip by «dot» option', () => {
			it('should return «true» for directory that starting with a period when option is enabled', () => {
				const filter = getFilter(['**/*'], [], { onlyFiles: false, dot: true });

				const entry = tests.getDirectoryEntry(true /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(actual);
			});

			it('should return «false» for directory that starting with a period when option is disabled', () => {
				const filter = getFilter(['**/*'], []);

				const entry = tests.getDirectoryEntry(true /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(!actual);
			});
		});

		describe('Skip by negative patterns', () => {
			it('should return «true» when negative patterns is not defined', () => {
				const filter = getFilter(['**/*'], []);

				const entry = tests.getDirectoryEntry(false /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(actual);
			});

			it('should return «true» when the directory does not match to negative patterns', () => {
				const filter = getFilter(['**/*'], ['**/pony/**']);

				const entry = tests.getDirectoryEntry(false /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(actual);
			});

			it('should return «true» when negative patterns has no effect to depth reading', () => {
				const filter = getFilter(['**/*'], ['*', '**/*']);

				const entry = tests.getDirectoryEntry(false /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(actual);
			});

			it('should return «false» when the directory match to negative patterns', () => {
				const filter = getFilter(['**/*'], ['fixtures/directory']);

				const entry = tests.getDirectoryEntry(false /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(!actual);
			});

			it('should return «false» when the directory match to negative patterns with effect to depth reading', () => {
				const filter = getFilter(['**/*'], ['fixtures/**']);

				const entry = tests.getDirectoryEntry(false /** dot */, false /** isSymbolicLink */);

				const actual = filter(entry);

				assert.ok(!actual);
			});
		});
	});

	describe('Immutability', () => {
		it('should return the data without changes', () => {
			const filter = getFilter(['**/*'], [], { onlyFiles: false });

			const entry = tests.getDirectoryEntry(false /** dot */, false /** isSymbolicLink */);

			const expected = entry.path;

			filter(entry);

			assert.equal(entry.path, expected);
		});
	});
});
