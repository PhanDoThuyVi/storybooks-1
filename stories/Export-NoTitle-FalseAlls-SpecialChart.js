import React from 'react';
import { storiesOf } from '@storybook/react';
import '@gooddata/react-components/styles/css/main.css';
import { Visualization, LineChart, AreaChart, BarChart, BubbleChart,ColumnChart, DonutChart, Headline, Heatmap, PieChart, PivotTable, ScatterPlot, ComboChart, HeaderPredicateFactory, Treemap } from '@gooddata/react-components';
import { Model } from '@gooddata/react-components';

import catalogJson from '../src/data/catalog.json';
import catalog from '../src/data/catalog';
const WRAPPER_STYLE = { width: 800, height: 400 };
const DOWNLOADER_ID = 'downloader';

const filterProduct = Model.positiveAttributeFilter('label.product.id.name',["Educationly","Explorer","CompuSci","PhoenixSoft","WonderKid"],true);
const filterStageName = Model.negativeAttributeFilter(`/gdc/md/${catalogJson.projectId}/obj/1805`,[`/gdc/md/${catalogJson.projectId}/obj/1095/elements?id=966649`]);
const absoluteDate = Model.absoluteDateFilter('closed.dataset.dt','2010-01-01','2010-06-30');
const relativeDate = Model.relativeDateFilter('closed.dataset.dt','GDC.time.year',-8,-8);

const m_SumDayToCloseRatio = Model.measure(`/gdc/md/${catalogJson.projectId}/obj/1146`)
   .localIdentifier('SumDayToClose')
   .ratio()
   .title('<button>Sum days to close</button>')
   .aggregation('sum')
   .filters(filterProduct)
   ;

const m_SumDayToClose = Model.measure(`/gdc/md/${catalogJson.projectId}/obj/1146`)
   .format('[>=100000][color=2190c0]█████ #,##0; [>=50000][color=2190c0]████░ #,##0; [>=30000][color=2190c0]███░░ #,##0; [>=20000][color=2190c0]██░░░ #,##0; [>=0][color=2190c0]█░░░░ #,##0; [=Null] No data;')
   .localIdentifier('SumDayToCloseNoRatio')
   .title('<button>Sum days to close</button>')
   .aggregation('sum')
   .filters(filterProduct)
   ;

const m_POPMeasure = Model.popMeasure('SumDayToCloseNoRatio', `/gdc/md/${catalogJson.projectId}/obj/323`)
.localIdentifier('POP_SumDayToClose')
.alias('POP SumDayToClose');

const m_PPMeasure = Model.previousPeriodMeasure('SumDayToCloseNoRatio', [{dataSet: `/gdc/md/${catalogJson.projectId}/obj/330`, periodsAgo: 1}])
.localIdentifier('PP_SumDayToClose')
.alias('PP SumDayToClose');

//M1: _Closed [BOP], M2: _Snapshot [BOP]
const m_SumAM = Model.arithmeticMeasure(['aaeb7jTCfexV', 'aazV2yX2gz2z'],'sum');
const m_ChangeAM = Model.arithmeticMeasure(['aaeb7jTCfexV', 'aazV2yX2gz2z'],'change');
const m_DifferenceAM = Model.arithmeticMeasure(['aaeb7jTCfexV', 'aazV2yX2gz2z'],'difference');
const m_RatioAM = Model.arithmeticMeasure(['aaeb7jTCfexV', 'aazV2yX2gz2z'],'ratio');
const m_MultiplicationAM = Model.arithmeticMeasure(['aaeb7jTCfexV', 'aazV2yX2gz2z'],'multiplication');

let exportResult: any;

function onExportReady(execution: any){
	exportResult = execution;
}

async function doExport(){
	const result = await exportResult({
		format: 'xlsx',
		//title: 'CustomTitle',
		includeFilterContext: false,
		//showFilters: [],
		mergeHeaders: false
	});
	//downloadFile(result.uri);
	window.open(result.uri);
}

storiesOf('Export/NoTitle-All params false', module)
    .add('NoTitle-ComboChart', () => (
	<div style={WRAPPER_STYLE}>
        <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
        <p>Applied filter by string, identifier, relativeDate</p>

        <ComboChart
            projectId={catalogJson.projectId}
            primaryMeasures={[catalog['_Close [BOP]'], catalog['_Close [EOP]'], m_SumDayToClose]}
            secondaryMeasures={[catalog['_Snapshot [BOP]'], m_POPMeasure]}
            viewBy={[catalog['Product'], catalog['Stage Name']]}
            config={{
                //primaryChartType: 'column',
                //secondaryChartType: 'line'
            }}
            drillableItems={[
                HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/949/elements?id=168279`),
             ]}
             onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
			filters = {[filterProduct,filterStageName,relativeDate]}
			onExportReady = {onExportReady}
        />
		<button onClick={doExport}>Export</button>
	</div>
    ))
    .add('NoTitle-Line', () => (
        <div style={WRAPPER_STYLE}>
            <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
            <p>Applied filter by string, identifier, relativeDate</p>

            <LineChart
                projectId={catalogJson.projectId}
                measures={[m_SumDayToClose, catalog['_Close [BOP]'], catalog['_Snapshot [BOP]'], m_POPMeasure, m_DifferenceAM, m_MultiplicationAM, m_RatioAM]}
                trendBy={catalog['Product']}
                drillableItems={[
                    HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/949/elements?id=168279`),
                 ]}
                 onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                filters = {[filterProduct,filterStageName,relativeDate]}
                onExportReady = {onExportReady}
            />
            <button onClick={doExport}>Export</button>
        </div>
        ))
        .add('NoTitle-Colunm', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
                <p>Stack% and dual axis</p>
    
                <ColumnChart
                    projectId={catalogJson.projectId}
                    measures={[m_SumDayToClose, catalog['_Close [BOP]'], catalog['_Snapshot [BOP]'], m_PPMeasure, m_DifferenceAM, m_MultiplicationAM, m_RatioAM]}
                    viewBy={[catalog['Product'], catalog['Stage Name']]}
                    config={{
                        stackMeasuresToPercent: true,
                        secondary_yaxis: {
                            measures: ['aazV2yX2gz2z']
                        }
                    }}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/949/elements?id=168279`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
            ))
            .add('NoTitle-Bar', () => (
                <div style={WRAPPER_STYLE}>
                    <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                    <p>Applied filter by string, identifier, relativeDate</p>
                    <p>Stack measures and dual axis</p>
        
                    <BarChart
                        projectId={catalogJson.projectId}
                        measures={[m_SumDayToClose, catalog['_Close [BOP]'], catalog['_Snapshot [BOP]'], m_PPMeasure, m_DifferenceAM, m_MultiplicationAM, m_RatioAM]}
                        viewBy={[catalog['Product'], catalog['Stage Name']]}
                        config={{
                            stackMeasures: true,
                            secondary_yaxis: {
                                measures: ['aazV2yX2gz2z']
                            }
                        }}
                        drillableItems={[
                            HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/949/elements?id=168279`),
                         ]}
                         onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                        filters = {[filterProduct,filterStageName,absoluteDate]}
                        onExportReady = {onExportReady}
                    />
                    <button onClick={doExport}>Export</button>
                </div>
                ))
                .add('NoTitle-Area', () => (
                    <div style={WRAPPER_STYLE}>
                        <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                        <p>Applied filter by string, identifier, relativeDate</p>
                        <p>ShowIn%</p>
            
                        <AreaChart
                            projectId={catalogJson.projectId}
                            measures={[m_SumDayToCloseRatio, catalog['_Snapshot [BOP]']]}
                            viewBy={[catalog['Product'], catalog['Stage Name']]}
                            config={{
                                stackMeasures: true,
                                secondary_yaxis: {
                                    measures: ['aazV2yX2gz2z']
                                }
                            }}
                            drillableItems={[
                                HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                             ]}
                             onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                            filters = {[filterProduct,filterStageName,absoluteDate]}
                            onExportReady = {onExportReady}
                        />
                        <button onClick={doExport}>Export</button>
                    </div>
                    ))
        .add('NoTitle-Bubble', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
            
                <BubbleChart
                    projectId={catalogJson.projectId}
                    xAxisMeasure={m_SumDayToClose}
                    yAxisMeasure={catalog['_Snapshot [BOP]']}
                    size={catalog['_Close [BOP]']}
                    viewBy={catalog['Product']}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                    ]}
                    onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
            <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('NoTitle-ScatterPlot', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
    
                <ScatterPlot
                    projectId={catalogJson.projectId}
                    xAxisMeasure={m_SumDayToClose}
                    yAxisMeasure={catalog['_Snapshot [BOP]']}
                    size={catalog['_Close [BOP]']}
                    attribute={catalog['Product']}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('NoTitle-Donut', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
    
                <DonutChart
                    projectId={catalogJson.projectId}
                    measures={[m_SumDayToClose]}
                    viewBy={catalog['Product']}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('NoTitle-Pie', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
    
                <PieChart
                    projectId={catalogJson.projectId}
                    measures={[m_SumDayToClose,catalog['_Snapshot [BOP]']]}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('NoTitle-Pivot', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
                <p>ChangeAM</p>
    
                <PivotTable
                    projectId={catalogJson.projectId}
                    measures={[catalog['_Snapshot [BOP]'], catalog['_Close [BOP]'], m_ChangeAM]}
                    rows={[catalog['Product'], catalog['Stage Name']]}
                    columns={[catalog['Department']]}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('NoTitle-Treemap', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
    
                <Treemap
                    projectId={catalogJson.projectId}
                    measures={[catalog['_Snapshot [BOP]'], catalog['_Close [BOP]'], m_ChangeAM]}
                    viewBy={catalog['Product']}
                    segmentBy={catalog['Stage Name']}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('NoTitle-HeatMap', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
    
                <Heatmap
                    projectId={catalogJson.projectId}
                    measure={catalog['_Snapshot [BOP]']}
                    rows={catalog['Product']}
                    columns={catalog['Stage Name']}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                    ]}
                    onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('NoTitle-Headline', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
    
                <Headline
                    projectId={catalogJson.projectId}
                    primaryMeasure={m_SumDayToClose}
                    secondaryMeasure={catalog['_Snapshot [BOP]']}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                    ]}
                    onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
                    
;

storiesOf('Export/SpecialChart', module)
        .add('Too Many', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
    
                <DonutChart
                    projectId={catalogJson.projectId}
                    measures={[m_SumDayToClose,catalog['_Snapshot [BOP]']]}
                    viewBy={catalog['Product']}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
        .add('Can not computed', () => (
            <div style={WRAPPER_STYLE}>
                <p>Format: xslx ; Title: Don't config ; includeFilterContext</p>
                <p>Applied filter by string, identifier, relativeDate</p>
                <p>ChangeAM</p>
    
                <PivotTable
                    projectId={catalogJson.projectId}
                    measures={[catalog['_Snapshot [BOP]'], catalog['_Close [BOP]'], m_ChangeAM]}
                    rows={[catalog['Product'], catalog['Stage Name']]}
                    columns={[catalog['Activity']]}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch(`/gdc/md/${catalogJson.projectId}/obj/952`),
                     ]}
                     onFiredDrillEvent={(data) => { console.log(data.executionContext); console.log(data.drillContext); }}
                    filters = {[filterProduct,filterStageName,absoluteDate]}
                    onExportReady = {onExportReady}
                />
                <button onClick={doExport}>Export</button>
            </div>
        ))
                    
;