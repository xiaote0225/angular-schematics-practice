import { strings } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
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

  it('成功产出档案，档案名为"/hello-leo-chen.component.t"',async () => {
    const name = "LeoChen";
    const runner = new SchematicTestRunner('schematics',collectionPath);
    const tree = await runner.runSchematicAsync('hello-world',{name:name},Tree.empty()).toPromise();
    const dasherizeName = strings.dasherize(name);
    const fullFileName = `/hello-${dasherizeName}.component.ts`;
    expect(tree.files).toContain(fullFileName);

    const fileContent = tree.readContent(fullFileName);
    expect(fileContent).toMatch(/hello-leo-chen/);
    expect(fileContent).toMatch(/HelloLeoChenComponent/);
  })
});
