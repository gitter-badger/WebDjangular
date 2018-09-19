import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebAngularDataStore } from '../../../@core/data/data-store/WebAngularDataStore.service';
import { WebAngularSmartTableDataSource } from '../../../@core/data/data-store/WebAngularSmartTableDataSource';

@Component({
    selector: 'wda-scaffold-edit',
    styleUrls: ['./scaffold-edit.component.scss'],
    templateUrl: './scaffold-edit.component.html',
})

export class ScaffoldEditComponent implements OnInit {
    entry: any = null;
    source: WebAngularSmartTableDataSource;
    currentModel: any;
    basePath: any;
    form: any;
    title: string = ";D";
    beforeTitle: string = "Editing";
    

    constructor(
        private route: ActivatedRoute,
        private datastore: WebAngularDataStore,
        private router: Router,
       ) {
        
    }
    ngOnInit(): void {
        this.route.url.subscribe(segments => {
            if(segments[0].path === "new"){
                this.beforeTitle = "Creating new"
            }
        })
        this.route.data.subscribe(data=>{
            this.currentModel = data.model;
            this.title = data.title;
            this.basePath = data.path;
            this.form = new this.currentModel.formClassRef();
            this.form.generateForm();
            this.getEntry();
        })
    }
    getEntry() {
        if (this.route.params['value'].id != null){
            this.datastore.findRecord(this.currentModel, this.route.params['value'].id, {
                include: 'groups'
            }).subscribe(
                (data) => {
                    this.entry = data;
                    this.form.populateForm(this.entry);
                }
            );
        }
    }
    onSubmit(){
        if (this.entry){
            this.update();
        }
        else{
            this.create();
        }
    }

    update(){
        this.form.updateModel(this.entry);

        let sub = this.entry.save().subscribe(
            (result) => {
                sub.unsubscribe();
            }
        )
    }

    create(){
        this.entry = this.datastore.createRecord(this.currentModel, this.form.value);
        let sub = this.entry.save().subscribe(
            (result) => {
                sub.unsubscribe();
            }
        )
    }

    
}