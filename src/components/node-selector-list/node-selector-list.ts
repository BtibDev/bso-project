// Angular
import { Component, OnInit, Input, Inject, OnChanges } from '@angular/core';

// Angular Material
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Models
import { NodeDefinition } from '../../model/node-definition-model';
import { Node, NodeSnapshot } from '../../model/node-model';

// Providers
import { NodeHandlerProvider } from '../../providers/node-handler/node-handler';
import { NodeDataProvider } from '../../providers/node-data/node-data';

@Component({
  selector: 'node-selector-list',
  templateUrl: 'node-selector-list.html'
})
export class NodeSelectorList implements OnInit {

  // Input values
  private isIn: NodeSnapshot[] = [];
  private nodeDefIndex: number = -1;
  private listIndex: number = -1;

  // Angular Table
  private text: string;
  public displayedColumns = ['name', 'description', 'actions'];
  public dataSource = new MatTableDataSource();

  constructor(
    private nodePvd: NodeHandlerProvider,
    private nodeDataPvd: NodeDataProvider,
    public dialogRef: MatDialogRef<NodeSelectorList>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isIn = data.isIn;
    this.nodeDefIndex = data.nodeDefIndex;
    this.listIndex = data.listIndex;
  }

  ////////////////////////////////////////////////////////////////
  // Life Cycle
  ////////////////////////////////////////////////////////////////

  public ngOnInit(): void {

    // Get all nodes from the NodeData provider and then update the internal list of nodes
    this.nodeDataPvd.loadNodeDefinitions();
    this.nodeDataPvd.nodeDefinitions$.subscribe(nodeDefinitions => {

      let nodes: Node[] = [];

      for (let nodeDef of nodeDefinitions) {

        nodeDef.lists.forEach(list => {

          nodes = nodes.concat(list.nodes);

          // Remove nodes that would be a list at the same level or below
          nodes = nodes.filter(node => {
            return node.nodeDefIndex < this.nodeDefIndex || node.nodeDefIndex == this.nodeDefIndex && node.listIndex < this.listIndex
          });

          // Remove nodes already related to the current node
          nodes = nodes.filter(node => {
            if (this.isIn.findIndex(nodeSnap => {
              return node.id === nodeSnap.id
            }) == -1) {
              return true;
            } else {
              return false;
            }
          })

          this.dataSource = new MatTableDataSource(nodes);

        });
      }

    });

  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  ////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////

  /**
   * The user selected a node
   * Close the the popup
   * @param node 
   */
  public selectNode(node: Node): void {

    this.dialogRef.close({
      node: node
    });

  }

  ////////////////////////////////////////////////////////////////
  // User interactions
  ////////////////////////////////////////////////////////////////

  /**
   * Handle search bar value
   * @param filterValue 
   */
  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}