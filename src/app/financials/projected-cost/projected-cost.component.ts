import { Component, OnInit } from '@angular/core';

declare var $: any;

declare interface DataTable {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'app-projected-cost',
  templateUrl: './projected-cost.component.html',
  styleUrls: ['./projected-cost.component.css']
})
export class ProjectedCostComponent implements OnInit {
  public planCstDTable: DataTable;

  constructor() { }

  ngOnInit() {
    this.planCstDTable = {
        headerRow: [ '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ],
        dataRows: [
            ['Projected', '300', '600', '800', '600', '3000', '300', '700', '1000', '600', '5500', '600', '3000'],
            ['Actual', '200', '800', '900', '500', '2500', '490', '300', '700', '1000', '600', '5500', '1050'],
        ]
     };
  }

  ngAfterViewInit() {
    $('#datatable').DataTable({
      'pagingType': 'full_numbers',
      'lengthMenu': [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      responsive: true,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }

    });

    var table = $('#datatable').DataTable();

    // Edit record
    table.on('click', '.edit', function() {
      let $tr = $(this).closest('tr');

      var data = table.row($tr).data();
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
    });

    // Delete a record
    table.on('click', '.remove', function(e) {
      let $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    });

    // Like record
    table.on('click', '.like', function() {
      alert('You clicked on Like button');
    });
  }

}
