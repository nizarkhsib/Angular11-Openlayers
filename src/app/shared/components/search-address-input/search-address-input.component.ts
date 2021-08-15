import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { FeatureApi } from '../../models/geolocation/feature';

@Component({
  selector: 'search-address-input',
  templateUrl: './search-address-input.component.html',
  styleUrls: ['./search-address-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchAddressInputComponent),
      multi: true
    }
  ]
})
export class SearchAddressInputComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() options: FeatureApi[] = [];
  filteredOptions: Observable<FeatureApi[]>;
  val = "";
  form: FormGroup;

  onChange: any = () => { }
  onTouch: any = () => { }
  @Output() selected = new EventEmitter<FeatureApi>();

  isSelected = false;

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      searchInput: [''],
      selectInput: [''],
    });

    this.filteredOptions = this.form.controls.searchInput.valueChanges
      .pipe(
        debounceTime(1000),
        startWith(''),
        map(value => this._filter(value))
      );

    this.form.controls.searchInput.valueChanges.subscribe(
      e => {
        this.value = e;
      }
    );
  }

  get getInput() {
    return this.form.controls.searchInput;
  }

  get getSelect() {
    return this.form.controls.selectInput;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.getInput.value != null && this.options != undefined)
      this._filter(this.getInput.value);
  }

  private _filter(value: string): FeatureApi[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.options.filter((option: FeatureApi) => option.properties.label.toLowerCase().includes(filterValue));
    }
    return null
  }

  addressSelected(event: MatAutocompleteSelectedEvent) {
    this.form.controls.searchInput.setValue(event.option.value.properties.label);
    this.selected.emit(event.option.value);
    this.value = event.option.value;
  }

  set value(val) {  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this.val = val;
    this.onChange(val);
    this.onTouch(val);
  }

  writeValue(value: any) {
    this.value = value;
  }

  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnInit() { }

}
