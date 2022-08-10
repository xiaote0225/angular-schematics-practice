import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('hello-world', () => {

  const runner = new SchematicTestRunner('schematics',collectionPath);

  const workspaceOptions:WorkspaceOptions = {
    name: 'workspace', //不重要的名字，随便取，不影响测试结果
    newProjectRoot: 'projects', //专案里，所有App的根目录，可以随便取，验证时会用到
    version: '6.0.0' //不重要的版本号，随便取，不影响测试结果
  }

  const appOptions:ApplicationOptions = {
    name: 'hello', //专案名称
    inlineStyle: false, //true or false 都可以，不影响测试结果
    inlineTemplate: false, // true or false 都可以，不影响测试结果
    routing: false, // true or false 都可以，不影响测试结果
    style: Style.Css, //Css / Less / Sass / scss / style都可以，不影响测试结果
    skipTests: false, // true or false 都可以，不影响测试结果
    skipPackageJson: false, // true or false 都可以，不影响测试结果
  }

  let appTree:UnitTestTree;

  beforeEach(async () => {
    appTree = await runner.runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      workspaceOptions
    ).toPromise();
    appTree = await runner.runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      appOptions,
      appTree
    ).toPromise();
  })

  it('測試 ng update', async () => {
    const tree = await runner.runExternalSchematicAsync('./src/migration.json', 'migration020', {}, appTree).toPromise();  
    const componentContent = tree.readContent('/projects/hello/src/app/app.component.ts');
    expect(componentContent).toContain('title = \'Leo Chen\'');
  });

});
