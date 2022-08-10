import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('hello-world', () => {
  // const expectResult = async (fileName?:string) => {
  //   const fullFileName = `/${fileName || 'hello'}`;
  //   const params = fileName ? {name: fileName} : {};
  //   const runner = new SchematicTestRunner('schematics',collectionPath);
  //   const tree = await runner.runSchematicAsync('hello-world',params,Tree.empty()).toPromise()
  //   expect(tree.files).toContain(fullFileName);
  //   expect(tree.readContent(fullFileName)).toEqual('world');
  // }

  // it('使用者没给档案名，则档案名为\'hello\'',async () => {
  //   const runner = new SchematicTestRunner('schematics',collectionPath);
  //   const tree = await runner.runSchematicAsync('hello-world',{},Tree.empty()).toPromise();
  //   expect(tree.files).toContain('/hello');
  // });
  // it('使用者有给档案名，则档案名为使用者给的档案名',async () => {
  //   const fileName = 'Leo';
  //   const runner = new SchematicTestRunner('schematics',collectionPath);
  //   const tree = await runner.runSchematicAsync('hello-world',{name:fileName},Tree.empty()).toPromise();
  //   expect(tree.files).toContain(`/${fileName}`);
  // });

  // it('使用者没给档案名，则档案名为"/hello",档案内容为world',async ()=>{
  //   expectResult();
  // });
  // it('使用者没给档案名，则档案名为使用者给的档案名,档案内容为world',async ()=>{
  //   expectResult('Leo');
  // });



  // it('成功产出档案，档案名为"/hello-leo-chen.component.t"',async () => {
  //   const name = "LeoChen";
  //   const runner = new SchematicTestRunner('schematics',collectionPath);
  //   const tree = await runner.runSchematicAsync('hello-world',{name:name},Tree.empty()).toPromise();
  //   const dasherizeName = strings.dasherize(name);
  //   const fullFileName = `/hello-${dasherizeName}.component.ts`;
  //   expect(tree.files).toContain(fullFileName);

  //   const fileContent = tree.readContent(fullFileName);
  //   expect(fileContent).toMatch(/hello-leo-chen/);
  //   expect(fileContent).toMatch(/HelloLeoChenComponent/);
  // })

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

  // const defaultOptions: HelloSchematics = {
  //   name: 'feature/Leo Chen'
  // };

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

  it('成功在预设专案路径下产出component,并将其加到AppModule的declarations里',async () => {
    // const options: HelloSchematics = {...defaultOptions};
    // const runner = new SchematicTestRunner('schematics',collectionPath);
    // let appTree = await runner.runExternalSchematicAsync(
    //   '@schematics/angular',
    //   'workspace',
    //   workspaceOptions
    // ).toPromise();
    
    // appTree = await runner.runExternalSchematicAsync(
    //   '@schematics/angular',
    //   'application',
    //   appOptions,
    //   appTree
    // ).toPromise();
    const tree = await runner.runSchematicAsync('ng-add',{},appTree).toPromise();
    // expect(tree.files).toContain('/projects/hello/src/app/feature/hello-leo-chen.component.ts');
    const moduleContent = tree.readContent('/projects/hello/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import.*FontAwesomeModule.*from '@fortawesome\/angular-fontawesome'/);
    expect(moduleContent).toMatch(/imports:\s*\[[^\]]+?,\r?\n\s+FontAwesomeModule\r?\n/m);

    //start...
    // 驗證 Component 的內容
    const componentContent = tree.readContent('/projects/hello/src/app/app.component.ts');
    expect(componentContent).toMatch(/import.*faCoffee.*from '@fortawesome\/free-solid-svg-icons'/);
    expect(componentContent).toContain('faCoffee = faCoffee;');

    // 驗證 HTML 的內容
    const htmlContent = tree.readContent('/projects/hello/src/app/app.component.html');
    expect(htmlContent).toContain('<fa-icon [icon]="faCoffee"></fa-icon>');
    //end...

    // 驗證 package.json 的內容
    const packageJson = JSON.parse(tree.readContent('/package.json'));
    const dependencies = packageJson.dependencies;
    expect(dependencies['@fortawesome/fontawesome-svg-core']).toBeDefined();
    expect(dependencies['@fortawesome/free-solid-svg-icons']).toBeDefined();
    expect(dependencies['@fortawesome/angular-fontawesome']).toBeDefined();

    // 驗證是否有執行安裝 package 的 task
    expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);

  });

  it('成功在 "world" 专案路径下产出Component,并将其加到AppModule的declarations里',async () => {
    // const options: HelloSchematics = {name: 'feature/Leo Chen',project:'world'};
    // const runner = new SchematicTestRunner('schematics',collectionPath);
    // let appTree = await runner.runExternalSchematicAsync(
    //   '@schematics/angular',
    //   'workspace',
    //   workspaceOptions
    // ).toPromise();
    
    // appTree = await runner.runExternalSchematicAsync(
    //   '@schematics/angular',
    //   'application',
    //   appOptions,
    //   appTree
    // ).toPromise();

    
    appTree = await runner.runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      { ...appOptions,name:'world'},
      appTree
    ).toPromise();

    const options = {project:'world'};
    
    const tree = await runner.runSchematicAsync('ng-add',options,appTree).toPromise();

    // expect(tree.files).toContain('/projects/world/src/app/feature/hello-leo-chen.component.ts');

    const moduleContent = tree.readContent('/projects/world/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import.*FontAwesomeModule.*from '@fortawesome\/angular-fontawesome'/);
    expect(moduleContent).toMatch(/imports:\s*\[[^\]]+?,\r?\n\s+FontAwesomeModule\r?\n/m);

    // 驗證 Component 的內容
    const componentContent = tree.readContent('/projects/world/src/app/app.component.ts');
    expect(componentContent).toMatch(/import.*faCoffee.*from '@fortawesome\/free-solid-svg-icons'/);
    expect(componentContent).toContain('faCoffee = faCoffee;');

    // 驗證 HTML 的內容
    const htmlContent = tree.readContent('/projects/world/src/app/app.component.html');
    expect(htmlContent).toContain('<fa-icon [icon]="faCoffee"></fa-icon>');

    // 驗證 package.json 的內容
    const packageJson = JSON.parse(tree.readContent('/package.json'));
    const dependencies = packageJson.dependencies;
    expect(dependencies['@fortawesome/fontawesome-svg-core']).toBeDefined();
    expect(dependencies['@fortawesome/free-solid-svg-icons']).toBeDefined();
    expect(dependencies['@fortawesome/angular-fontawesome']).toBeDefined();

    // 驗證是否有執行安裝 package 的 task
    expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);

  });

});
