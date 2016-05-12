(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Blob, FileSaver, $aside, $timeout, nipypePackages, toastr, localStorageService, $window, hotkeys) {
    var main = this;

    activate();

    function activate() {
      getNipypePackages();
      getModel();
      $timeout(function () {
        main.classAnimation = 'rubberBand';
      }, 4000);
    }

    main.showRightSidebar=true;



    function getNipypePackages() {
      main.packages = nipypePackages.getNipypePackages();
      main.interfaces = main.packages.interfaces;
      main.modules = main.packages.modules;
      main.categories = main.modules[""].submodules;
      // TODO move all this to nipype service
      main.interface_fullnames = Object.keys(main.interfaces);
      main.interface_names = ['XNATSink', 'XNATSource', 'JSONFileGrabber', 'DataFinder', 'FreeSurferSource', 'SSHDataGrabber', 'JSONFileSink', 'SQLiteSink', 'SelectFiles', 'IOBase', 'DataGrabber', 'DataSink', 'MySQLSink', 'StdOutCommandLine', 'MpiCommandLine', 'Interface', 'BaseInterface', 'CommandLine', 'SEMLikeCommandLine', 'Merge', 'Select', 'Rename', 'Split', 'AssertEqual', 'Function', 'CSVReader', 'IdentityInterface', 'Fim', 'SkullStrip', 'Merge', 'SmainTrain', 'ZCutUp', 'TCorr1D', 'SmainTest', 'Warp', 'Copy', 'Despike', 'TCorrMap', 'AFNICommand', 'BlurInMask', 'TCat', 'Refit', 'AutoTcorrelate', 'Detrend', 'Autobox', 'Retroicor', 'Fourier', 'Maskave', 'BrickStat', 'Resample', 'TStat', 'Automask', 'TShift', 'ROIStats', 'Bandpass', 'Eval', 'Calc', 'Means', 'Allineate', 'Volreg', 'To3D', 'TCorrelate', 'AFNItoNIFTI', 'AverageImages', 'CreateTiledMosaic', 'WarpTimeSeriesImageMultiTransform', 'WarpImageMultiTransform', 'JacobianDeterminant', 'LaplacianThickness', 'ApplyTransforms', 'N4BiasFieldCorrection', 'MultiplyImages', 'ANTS', 'ConvertScalarImageToRGB', 'Registration', 'AverageAffineTransform', 'Atropos', 'ANTSCommand', 'ApplyTransformsToPoints', 'antsCorticalThickness', 'JointFusion', 'SFPICOCalibData', 'Image2Voxel', 'DTIFit', 'AnalyzeHeader', 'QBallMX', 'TrackBedpostxProba', 'TrackBallStick', 'FSL2Scheme', 'TrackBedpostxDeter', 'ComputeMeanDiffusivity', 'ModelFit', 'SFLUTGen', 'MESD', 'TrackBayesDirac', 'SFPeaks', 'ComputeFractionalAnisotropy', 'LinRecon', 'DTLUTGen', 'ComputeTensorTrace', 'ImageStats', 'VtkStreamlines', 'NIfTIDT2Camino', 'PicoPDFs', 'TrackDT', 'ComputeEigensystem', 'Conmat', 'Track', 'DT2NIfTI', 'Shredder', 'TrackBootstrap', 'TractShredder', 'ProcStreamlines', 'TrackPICo', 'DTMetric', 'Trackvis2Camino', 'Camino2Trackvis', 'NetworkXMetrics', 'Parcellate', 'NetworkBasedStatistic', 'CFFConverter', 'ROIGen', 'AverageNetworks', 'MergeCNetworks', 'CreateMatrix', 'CreateNodes', 'ODFRecon', 'DTITracker', 'HARDIMat', 'ODFTracker', 'TrackMerge', 'SplineFilter', 'DTIRecon', 'DTI', 'TrackDensityMap', 'TensorMode', 'Denoise', 'Resample', 'SimulateMultiTensor', 'PointsWarp', 'ApplyWarp', 'AnalyzeWarp', 'Registration', 'EditTransform', 'Binarize', 'MRITessellate', 'Resample', 'MRIMarchingCubes', 'MRIsConvert', 'Label2Vol', 'ParseDICOMDir', 'MRISPreproc', 'BBRegister', 'Concatenate', 'ApplyMask', 'GLMFit', 'DICOMConvert', 'ReconAll', 'Tkregister2', 'SampleToSurface', 'RobustRegister', 'Surface2VolTransform', 'MRIConvert', 'SurfaceSmooth', 'FSCommand', 'Smooth', 'SmoothTessellation', 'SynthesizeFLASH', 'SegStats', 'SurfaceSnapshots', 'OneSampleTTest', 'MRIPretess', 'ApplyVolTransform', 'SurfaceTransform', 'ImageInfo', 'FitMSParams', 'MakeAverageSubject', 'UnpackSDICOMDir', 'MS_LDA', 'ExtractMainComponent', 'EPIDeWarp', 'AvScale', 'Level1Design', 'ImageMaths', 'EpiReg', 'DilateImage', 'FILMGLS', 'Merge', 'ConvertXFM', 'FIRST', 'ProjThresh', 'DistanceMap', 'SpatialFilter', 'ConvertWarp', 'MathsCommand', 'ProbTrackX2', 'ErodeImage', 'MELODIC', 'RobustFOV', 'ApplyXfm', 'ProbTrackX', 'Threshold', 'FSLCommand', 'CopyGeom', 'MaxImage', 'IsotropicSmooth', 'Slicer', 'ApplyMask', 'MeanImage', 'SwapDimensions', 'FUGUE', 'Eddy', 'ChangeDataType', 'MultipleRegressDesign', 'SMM', 'FilterRegressor', 'FAST', 'PrepareFieldmap', 'ImageStats', 'BET', 'VecReg', 'FEATModel', 'TemporalFilter', 'FNIRT', 'SUSAN', 'XFibres', 'TractSkeleton', 'L2Model', 'ImageMeants', 'Cluster', 'WarpPointsToStd', 'Split', 'MultiImageMaths', 'WarpUtils', 'FSLXCommand', 'MotionOutliers', 'SigLoss', 'Randomise', 'SmoothEstimate', 'ApplyTOPUP', 'InvWarp', 'Smooth', 'ContrastMgr', 'XFibres5', 'XFibres4', 'UnaryMaths', 'ExtractROI', 'Reorient2Std', 'FLIRT', 'Overlay', 'BEDPOSTX', 'GLM', 'SliceTimer', 'FEATRegister', 'PRELUDE', 'MakeDyadicVectors', 'SigLoss', 'FEAT', 'BEDPOSTX4', 'EddyCorrect', 'MCFLIRT', 'PlotTimeSeries', 'ApplyWarp', 'FindTheBiggest', 'PlotMotionParams', 'WarpPoints', 'BEDPOSTX5', 'TOPUP', 'DTIFit', 'BinaryMaths', 'FLAMEO', 'PowerSpectrum', 'Complex', 'MedicAlgorithmSPECTRE2010', 'JistCortexSurfaceMeshInflation', 'JistBrainMp2rageDuraEstimation', 'JistBrainPartialVolumeFilter', 'JistBrainMgdmSegmentation', 'MedicAlgorithmLesionToads', 'JistLaminarProfileCalculator', 'MedicAlgorithmImageCalculator', 'JistLaminarProfileSampling', 'JistLaminarVolumetricLayering', 'JistBrainMp2rageSkullStripping', 'RandomVol', 'MedicAlgorithmThresholdToBinaryMask', 'MedicAlgorithmN3', 'JistIntensityMp2rageMasking', 'JistLaminarProfileGeometry', 'MedicAlgorithmMipavReorient', 'JistLaminarROIAveraging', 'WatershedBEM', 'Tracks2Prob', 'FindShPeaks', 'GenerateDirections', 'Directions2Amplitude', 'FilterTracks', 'Tensor2Vector', 'MRTrixViewer', 'MRTransform', 'SphericallyDeconvolutedStreamlineTrack', 'Tensor2ApparentDiffusion', 'MRMultiply', 'ProbabilisticSphericallyDeconvolutedStreamlineTrack', 'MRConvert', 'MRTrixInfo', 'DiffusionTensorStreamlineTrack', 'MedianFilter3D', 'Tensor2FractionalAnisotropy', 'ConstrainedSphericalDeconvolution', 'EstimateResponseForSH', 'Threshold', 'Erode', 'GenerateWhiteMatterMask', 'StreamlineTrack', 'MRTrix2TrackVis', 'DWI2SphericalHarmonicsImage', 'FSL2MRTrix', 'DWI2Tensor', 'FmriRealign4d', 'FitGLM', 'Similarity', 'SpaceTimeRealigner', 'Trim', 'ComputeMask', 'EstimateContrast', 'CoherenceAnalyzer', 'gtractAverageBvalues', 'BRAINSLinearModelerEPCA', 'VBRAINSDemonWarp', 'gtractTransformToDisplacementField', 'TextureMeasureFilter', 'BRAINSFit', 'GenerateCsfClippedFromClassifiedImage', 'DilateMask', 'gtractInvertDisplacementField', 'DWIConvert', 'STAPLEAnalysis', 'BRAINSSnapShotWriter', 'BRAINSLandmarkInitializer', 'gtractTensor', 'compareTractInclusion', 'ErodeImage', 'BRAINSClipInferior', 'landmarksConstellationAligner', 'gtractResampleCodeImage', 'fiberstats', 'DWISimpleCompare', 'gtractCoRegAnatomy', 'BRAINSTransformConvert', 'BRAINSTalairach', 'GenerateAverageLmkFile', 'CannyEdge', 'GenerateLabelMapFromProbabilityMap', 'extractNrrdVectorIndex', 'BRAINSConstellationModeler', 'BRAINSEyeDetector', 'gtractFastMarchingTracking', 'gtractCoregBvalues', 'BRAINSMush', 'SphericalCoordinateGeneration', 'HistogramMatchingFilter', 'fiberprocess', 'BRAINSPosteriorToContinuousClass', 'ImageRegionPlotter', 'gtractCostFastMarching', 'UnbiasedNonLocalMeans', 'BRAINSABC', 'SimilarityIndex', 'UKFTractography', 'GradientAnisotropicDiffusionImageFilter', 'dtiprocess', 'GenerateSummedGradientImage', 'BRAINSDemonWarp', 'insertMidACPCpoint', 'BRAINSResample', 'gtractResampleFibers', 'gtractResampleB0', 'DumpBinaryTrainingVectors', 'gtractResampleDWIInPlace', 'gtractInvertBSplineTransform', 'CannySegmentationLevelSetImageFilter', 'FlippedDifference', 'gtractResampleAnisotropy', 'landmarksConstellationWeights', 'dtiaverage', 'gtractClipAnisotropy', 'scalartransform', 'gtractCreateGuideFiber', 'BRAINSMultiSTAPLE', 'JointHistogram', 'CleanUpOverlapLabels', 'BRAINSLmkTransform', 'BRAINSAlignMSP', 'DilateImage', 'BRAINSROIAuto', 'BinaryMaskEditorBasedOnLandmarks', 'BRAINSTrimForegroundInDirection', 'fcsv_to_hdf5', 'gtractAnisotropyMap', 'ShuffleVectorsModule', 'BRAINSTransformFromFiducials', 'NeighborhoodMean', 'GenerateBrainClippedImage', 'BRAINSCut', 'fibertrack', 'BRAINSCreateLabelMapFromProbabilityMaps', 'TextureFromNoiseImageFilter', 'dtiestim', 'NeighborhoodMedian', 'DWICompare', 'BRAINSResize', 'gtractConcatDwi', 'gtractInvertRigidTransform', 'DistanceMaps', 'gtractCopyImageOrientation', 'gtractFiberTracking', 'BRAINSTalairachMask', 'HammerAttributeCreator', 'FindCenterOfBrain', 'gtractImageConformity', 'maxcurvature', 'BRAINSConstellationDetector', 'LandmarksCompare', 'BRAINSInitializedControlPoints', 'ESLR', 'GenerateTestImage', 'HistogramMatching', 'ModelToLabelMap', 'DTIimport', 'DWIRicianLMMSEFilter', 'ResampleDTIVolume', 'ImageLabelCombine', 'GaussianBlurImageFilter', 'BRAINSROIAuto', 'OtsuThresholdSegmentation', 'CheckerBoardFilter', 'MaskScalarVolume', 'OtsuThresholdImageFilter', 'ACPCTransform', 'ExpertAutomatedRegistration', 'BRAINSDemonWarp', 'ResampleScalarVectorDWIVolume', 'BSplineToDeformationField', 'ResampleScalarVolume', 'ExtractSkeleton', 'DiffusionWeightedVolumeMasking', 'BRAINSResample', 'AffineRegistration', 'MergeModels', 'RobustStatisticsSegmenter', 'ModelMaker', 'MedianImageFilter', 'ProbeVolumeWithModel', 'VotingBinaryHoleFillingImageFilter', 'CastScalarVolume', 'N4ITKBiasFieldCorrection', 'LabelMapSmoothing', 'GradientAnisotropicDiffusion', 'LinearRegistration', 'OrientScalarVolume', 'CurvatureAnisotropicDiffusion', 'MultiResolutionAffineRegistration', 'ThresholdScalarVolume', 'AddScalarVolumes', 'SimpleRegionGrowingSegmentation', 'DWIUnbiasedNonLocalMeansFilter', 'EMSegmentTransformToNewFormat', 'DicomToNrrdConverter', 'MultiplyScalarVolumes', 'GrayscaleFillHoleImageFilter', 'DTIexport', 'DiffusionTensorScalarMeasurements', 'VBRAINSDemonWarp', 'TractographyLabelMapSeeding', 'DWIJointRicianLMMSEFilter', 'IntensityDifferenceMetric', 'SubtractScalarVolumes', 'BSplineDeformableRegistration', 'RigidRegistration', 'GrayscaleGrindPeakImageFilter', 'EMSegmentCommandLine', 'GrayscaleModelMaker', 'DWIToDTIEstimation', 'BRAINSFit', 'PETStandardUptakeValueComputation', 'FiducialRegistration', 'DARTEL', 'Normalize', 'Level1Design', 'CreateWarped', 'ApplyTransform', 'Realign', 'VBMSegment', 'DARTELNorm2MNI', 'ThresholdStatistics', 'FactorialDesign', 'CalcCoregAffine', 'Coregister', 'MultipleRegressionDesign', 'SPMCommand', 'ResliceToReference', 'TwoSampleTTestDesign', 'EstimateModel', 'NewSegment', 'Normalize12', 'SliceTiming', 'Smooth', 'ApplyInverseDeformation', 'ApplyDeformations', 'PairedTTestDesign', 'Segment', 'Analyze2nii', 'EstimateContrast', 'OneSampleTTestDesign', 'Threshold', 'DicomImport', 'Reslice', 'MatlabCommand', 'VtoMat', 'Vnifti2Image'];
    }

    function getModel() {
      console.log(localStorageService.get('model'));
      if (localStorageService.get('model')){
        return localStorageService.get('model');
      }
      return main.model;
      localStorageService.set('model', main.model);
    }

    main.isCollapsed = false;

    main.nodeSelected = null;

    main.menuOpen = false;

    main.openAside = function () {
      function postClose() {
        main.menuOpen = false;
      }

      if (!main.menuOpen) {
        main.menuOpen = true;

        $aside.open({
          templateUrl: 'app/main/menu.html',
          placement: 'right',
          size: 'md',
          backdrop: true,
          controllerAs: 'menu',
          controller: function (nipypePackages, $uibModalInstance) {
            var menu = this;
            menu.isCollapsed = false;
            menu.interface_names = ['XNATSink', 'XNATSource', 'JSONFileGrabber', 'DataFinder', 'FreeSurferSource', 'SSHDataGrabber', 'JSONFileSink', 'SQLiteSink', 'SelectFiles', 'IOBase', 'DataGrabber', 'DataSink', 'MySQLSink', 'StdOutCommandLine', 'MpiCommandLine', 'Interface', 'BaseInterface', 'CommandLine', 'SEMLikeCommandLine', 'Merge', 'Select', 'Rename', 'Split', 'AssertEqual', 'Function', 'CSVReader', 'IdentityInterface', 'Fim', 'SkullStrip', 'Merge', 'SmainTrain', 'ZCutUp', 'TCorr1D', 'SmainTest', 'Warp', 'Copy', 'Despike', 'TCorrMap', 'AFNICommand', 'BlurInMask', 'TCat', 'Refit', 'AutoTcorrelate', 'Detrend', 'Autobox', 'Retroicor', 'Fourier', 'Maskave', 'BrickStat', 'Resample', 'TStat', 'Automask', 'TShift', 'ROIStats', 'Bandpass', 'Eval', 'Calc', 'Means', 'Allineate', 'Volreg', 'To3D', 'TCorrelate', 'AFNItoNIFTI', 'AverageImages', 'CreateTiledMosaic', 'WarpTimeSeriesImageMultiTransform', 'WarpImageMultiTransform', 'JacobianDeterminant', 'LaplacianThickness', 'ApplyTransforms', 'N4BiasFieldCorrection', 'MultiplyImages', 'ANTS', 'ConvertScalarImageToRGB', 'Registration', 'AverageAffineTransform', 'Atropos', 'ANTSCommand', 'ApplyTransformsToPoints', 'antsCorticalThickness', 'JointFusion', 'SFPICOCalibData', 'Image2Voxel', 'DTIFit', 'AnalyzeHeader', 'QBallMX', 'TrackBedpostxProba', 'TrackBallStick', 'FSL2Scheme', 'TrackBedpostxDeter', 'ComputeMeanDiffusivity', 'ModelFit', 'SFLUTGen', 'MESD', 'TrackBayesDirac', 'SFPeaks', 'ComputeFractionalAnisotropy', 'LinRecon', 'DTLUTGen', 'ComputeTensorTrace', 'ImageStats', 'VtkStreamlines', 'NIfTIDT2Camino', 'PicoPDFs', 'TrackDT', 'ComputeEigensystem', 'Conmat', 'Track', 'DT2NIfTI', 'Shredder', 'TrackBootstrap', 'TractShredder', 'ProcStreamlines', 'TrackPICo', 'DTMetric', 'Trackvis2Camino', 'Camino2Trackvis', 'NetworkXMetrics', 'Parcellate', 'NetworkBasedStatistic', 'CFFConverter', 'ROIGen', 'AverageNetworks', 'MergeCNetworks', 'CreateMatrix', 'CreateNodes', 'ODFRecon', 'DTITracker', 'HARDIMat', 'ODFTracker', 'TrackMerge', 'SplineFilter', 'DTIRecon', 'DTI', 'TrackDensityMap', 'TensorMode', 'Denoise', 'Resample', 'SimulateMultiTensor', 'PointsWarp', 'ApplyWarp', 'AnalyzeWarp', 'Registration', 'EditTransform', 'Binarize', 'MRITessellate', 'Resample', 'MRIMarchingCubes', 'MRIsConvert', 'Label2Vol', 'ParseDICOMDir', 'MRISPreproc', 'BBRegister', 'Concatenate', 'ApplyMask', 'GLMFit', 'DICOMConvert', 'ReconAll', 'Tkregister2', 'SampleToSurface', 'RobustRegister', 'Surface2VolTransform', 'MRIConvert', 'SurfaceSmooth', 'FSCommand', 'Smooth', 'SmoothTessellation', 'SynthesizeFLASH', 'SegStats', 'SurfaceSnapshots', 'OneSampleTTest', 'MRIPretess', 'ApplyVolTransform', 'SurfaceTransform', 'ImageInfo', 'FitMSParams', 'MakeAverageSubject', 'UnpackSDICOMDir', 'MS_LDA', 'ExtractMainComponent', 'EPIDeWarp', 'AvScale', 'Level1Design', 'ImageMaths', 'EpiReg', 'DilateImage', 'FILMGLS', 'Merge', 'ConvertXFM', 'FIRST', 'ProjThresh', 'DistanceMap', 'SpatialFilter', 'ConvertWarp', 'MathsCommand', 'ProbTrackX2', 'ErodeImage', 'MELODIC', 'RobustFOV', 'ApplyXfm', 'ProbTrackX', 'Threshold', 'FSLCommand', 'CopyGeom', 'MaxImage', 'IsotropicSmooth', 'Slicer', 'ApplyMask', 'MeanImage', 'SwapDimensions', 'FUGUE', 'Eddy', 'ChangeDataType', 'MultipleRegressDesign', 'SMM', 'FilterRegressor', 'FAST', 'PrepareFieldmap', 'ImageStats', 'BET', 'VecReg', 'FEATModel', 'TemporalFilter', 'FNIRT', 'SUSAN', 'XFibres', 'TractSkeleton', 'L2Model', 'ImageMeants', 'Cluster', 'WarpPointsToStd', 'Split', 'MultiImageMaths', 'WarpUtils', 'FSLXCommand', 'MotionOutliers', 'SigLoss', 'Randomise', 'SmoothEstimate', 'ApplyTOPUP', 'InvWarp', 'Smooth', 'ContrastMgr', 'XFibres5', 'XFibres4', 'UnaryMaths', 'ExtractROI', 'Reorient2Std', 'FLIRT', 'Overlay', 'BEDPOSTX', 'GLM', 'SliceTimer', 'FEATRegister', 'PRELUDE', 'MakeDyadicVectors', 'SigLoss', 'FEAT', 'BEDPOSTX4', 'EddyCorrect', 'MCFLIRT', 'PlotTimeSeries', 'ApplyWarp', 'FindTheBiggest', 'PlotMotionParams', 'WarpPoints', 'BEDPOSTX5', 'TOPUP', 'DTIFit', 'BinaryMaths', 'FLAMEO', 'PowerSpectrum', 'Complex', 'MedicAlgorithmSPECTRE2010', 'JistCortexSurfaceMeshInflation', 'JistBrainMp2rageDuraEstimation', 'JistBrainPartialVolumeFilter', 'JistBrainMgdmSegmentation', 'MedicAlgorithmLesionToads', 'JistLaminarProfileCalculator', 'MedicAlgorithmImageCalculator', 'JistLaminarProfileSampling', 'JistLaminarVolumetricLayering', 'JistBrainMp2rageSkullStripping', 'RandomVol', 'MedicAlgorithmThresholdToBinaryMask', 'MedicAlgorithmN3', 'JistIntensityMp2rageMasking', 'JistLaminarProfileGeometry', 'MedicAlgorithmMipavReorient', 'JistLaminarROIAveraging', 'WatershedBEM', 'Tracks2Prob', 'FindShPeaks', 'GenerateDirections', 'Directions2Amplitude', 'FilterTracks', 'Tensor2Vector', 'MRTrixViewer', 'MRTransform', 'SphericallyDeconvolutedStreamlineTrack', 'Tensor2ApparentDiffusion', 'MRMultiply', 'ProbabilisticSphericallyDeconvolutedStreamlineTrack', 'MRConvert', 'MRTrixInfo', 'DiffusionTensorStreamlineTrack', 'MedianFilter3D', 'Tensor2FractionalAnisotropy', 'ConstrainedSphericalDeconvolution', 'EstimateResponseForSH', 'Threshold', 'Erode', 'GenerateWhiteMatterMask', 'StreamlineTrack', 'MRTrix2TrackVis', 'DWI2SphericalHarmonicsImage', 'FSL2MRTrix', 'DWI2Tensor', 'FmriRealign4d', 'FitGLM', 'Similarity', 'SpaceTimeRealigner', 'Trim', 'ComputeMask', 'EstimateContrast', 'CoherenceAnalyzer', 'gtractAverageBvalues', 'BRAINSLinearModelerEPCA', 'VBRAINSDemonWarp', 'gtractTransformToDisplacementField', 'TextureMeasureFilter', 'BRAINSFit', 'GenerateCsfClippedFromClassifiedImage', 'DilateMask', 'gtractInvertDisplacementField', 'DWIConvert', 'STAPLEAnalysis', 'BRAINSSnapShotWriter', 'BRAINSLandmarkInitializer', 'gtractTensor', 'compareTractInclusion', 'ErodeImage', 'BRAINSClipInferior', 'landmarksConstellationAligner', 'gtractResampleCodeImage', 'fiberstats', 'DWISimpleCompare', 'gtractCoRegAnatomy', 'BRAINSTransformConvert', 'BRAINSTalairach', 'GenerateAverageLmkFile', 'CannyEdge', 'GenerateLabelMapFromProbabilityMap', 'extractNrrdVectorIndex', 'BRAINSConstellationModeler', 'BRAINSEyeDetector', 'gtractFastMarchingTracking', 'gtractCoregBvalues', 'BRAINSMush', 'SphericalCoordinateGeneration', 'HistogramMatchingFilter', 'fiberprocess', 'BRAINSPosteriorToContinuousClass', 'ImageRegionPlotter', 'gtractCostFastMarching', 'UnbiasedNonLocalMeans', 'BRAINSABC', 'SimilarityIndex', 'UKFTractography', 'GradientAnisotropicDiffusionImageFilter', 'dtiprocess', 'GenerateSummedGradientImage', 'BRAINSDemonWarp', 'insertMidACPCpoint', 'BRAINSResample', 'gtractResampleFibers', 'gtractResampleB0', 'DumpBinaryTrainingVectors', 'gtractResampleDWIInPlace', 'gtractInvertBSplineTransform', 'CannySegmentationLevelSetImageFilter', 'FlippedDifference', 'gtractResampleAnisotropy', 'landmarksConstellationWeights', 'dtiaverage', 'gtractClipAnisotropy', 'scalartransform', 'gtractCreateGuideFiber', 'BRAINSMultiSTAPLE', 'JointHistogram', 'CleanUpOverlapLabels', 'BRAINSLmkTransform', 'BRAINSAlignMSP', 'DilateImage', 'BRAINSROIAuto', 'BinaryMaskEditorBasedOnLandmarks', 'BRAINSTrimForegroundInDirection', 'fcsv_to_hdf5', 'gtractAnisotropyMap', 'ShuffleVectorsModule', 'BRAINSTransformFromFiducials', 'NeighborhoodMean', 'GenerateBrainClippedImage', 'BRAINSCut', 'fibertrack', 'BRAINSCreateLabelMapFromProbabilityMaps', 'TextureFromNoiseImageFilter', 'dtiestim', 'NeighborhoodMedian', 'DWICompare', 'BRAINSResize', 'gtractConcatDwi', 'gtractInvertRigidTransform', 'DistanceMaps', 'gtractCopyImageOrientation', 'gtractFiberTracking', 'BRAINSTalairachMask', 'HammerAttributeCreator', 'FindCenterOfBrain', 'gtractImageConformity', 'maxcurvature', 'BRAINSConstellationDetector', 'LandmarksCompare', 'BRAINSInitializedControlPoints', 'ESLR', 'GenerateTestImage', 'HistogramMatching', 'ModelToLabelMap', 'DTIimport', 'DWIRicianLMMSEFilter', 'ResampleDTIVolume', 'ImageLabelCombine', 'GaussianBlurImageFilter', 'BRAINSROIAuto', 'OtsuThresholdSegmentation', 'CheckerBoardFilter', 'MaskScalarVolume', 'OtsuThresholdImageFilter', 'ACPCTransform', 'ExpertAutomatedRegistration', 'BRAINSDemonWarp', 'ResampleScalarVectorDWIVolume', 'BSplineToDeformationField', 'ResampleScalarVolume', 'ExtractSkeleton', 'DiffusionWeightedVolumeMasking', 'BRAINSResample', 'AffineRegistration', 'MergeModels', 'RobustStatisticsSegmenter', 'ModelMaker', 'MedianImageFilter', 'ProbeVolumeWithModel', 'VotingBinaryHoleFillingImageFilter', 'CastScalarVolume', 'N4ITKBiasFieldCorrection', 'LabelMapSmoothing', 'GradientAnisotropicDiffusion', 'LinearRegistration', 'OrientScalarVolume', 'CurvatureAnisotropicDiffusion', 'MultiResolutionAffineRegistration', 'ThresholdScalarVolume', 'AddScalarVolumes', 'SimpleRegionGrowingSegmentation', 'DWIUnbiasedNonLocalMeansFilter', 'EMSegmentTransformToNewFormat', 'DicomToNrrdConverter', 'MultiplyScalarVolumes', 'GrayscaleFillHoleImageFilter', 'DTIexport', 'DiffusionTensorScalarMeasurements', 'VBRAINSDemonWarp', 'TractographyLabelMapSeeding', 'DWIJointRicianLMMSEFilter', 'IntensityDifferenceMetric', 'SubtractScalarVolumes', 'BSplineDeformableRegistration', 'RigidRegistration', 'GrayscaleGrindPeakImageFilter', 'EMSegmentCommandLine', 'GrayscaleModelMaker', 'DWIToDTIEstimation', 'BRAINSFit', 'PETStandardUptakeValueComputation', 'FiducialRegistration', 'DARTEL', 'Normalize', 'Level1Design', 'CreateWarped', 'ApplyTransform', 'Realign', 'VBMSegment', 'DARTELNorm2MNI', 'ThresholdStatistics', 'FactorialDesign', 'CalcCoregAffine', 'Coregister', 'MultipleRegressionDesign', 'SPMCommand', 'ResliceToReference', 'TwoSampleTTestDesign', 'EstimateModel', 'NewSegment', 'Normalize12', 'SliceTiming', 'Smooth', 'ApplyInverseDeformation', 'ApplyDeformations', 'PairedTTestDesign', 'Segment', 'Analyze2nii', 'EstimateContrast', 'OneSampleTTestDesign', 'Threshold', 'DicomImport', 'Reslice', 'MatlabCommand', 'VtoMat', 'Vnifti2Image'];
            menu.packages = nipypePackages.getNipypePackages();
            menu.interfaces = menu.packages.interfaces;
            menu.categories = menu.packages.modules[""].submodules;
            menu.organizedInterfaces = nipypePackages.getOrganizedInterfaces();
            menu.interface_fullnames = Object.keys(menu.packages.interfaces);
            menu.interfacesByCategory = function (category) {
              return menu.organizedInterfaces[category];
            };
            menu.selectItem = function (interface_full_name, model, interface_name) {
              $uibModalInstance.dismiss();
              var splitName = interface_name.split('.');
              var displayName = splitName[splitName.length - 1];
              main.showToastr('Adding ' + displayName + ' to workflow');
              main.addNewNode(menu.interfaces[interface_full_name]);
              main.menuOpen = false;
            };

          }
        }).result.then(postClose, postClose);;
      }
    };

    hotkeys.add({
      combo: 'ctrl+n',
      description: 'Add New Node to Workflow',
      callback: function(){
        main.openAside();
      }
    });


    main.classAnimation = '';
    main.showToastr = function (message) {
      toastr.info(message);
      main.classAnimation = '';
    };


    function updateModel(updatedModel) {
      // TODO
      // modelService.setModel(updatedModel);
    }


    main.downloadJSON = function () {
      var obj = main.model;
      var data = angular.toJson(obj);
      var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      main.showToastr('Downloaded workflow.json');
      FileSaver.saveAs(blob, "workflow.json");
    };





    main.deleteSelected = function () {
      //TODO
      main.model.deleteSelected();
    };

    hotkeys.add({
      combo: 'del',
      description: 'Delete Selected Nodes and Edges',
      callback: function(){
        main.deleteSelected();
      }
    });

    hotkeys.add({
      combo: 'ctrl+a',
      description: 'Select All Nodes and Edges',
      callback: function(){
        main.selectAll();
      }
    });

    main.deleteNode = function (node_id) {
      //TODO
      console.log('TODO delete node');
      // main.modelService.deleteSelected();
    };

    main.editorWidth = $window.innerWidth;
    main.editorHeight = $window.innerHeight;


    main.selectedItems = [];



    // nodes currently on canvas, {id: node}
    // format of each node: {id: id_number, interface: interface, x: x, y: y}
    // where id is a number and the node_object properties are interface, x position, and y position
    var current_nodes = {};

    var input_dataset = {"inputs": {}, "outputs": {"dataset": null}, "name": "input dataset"};
    current_nodes[0] = {id: 0, x: 0, y: 0, interface: input_dataset};

    var next_node_id = 1;

    // list of edges currently on canvas
    // format of each edge: {id: id_number, out_node: out_node, outlet: outlet, in_node: in_node, inlet: inlet}
    var current_edges = {};

    var next_edge_id = 0;


    main.model = {
      nodes: current_nodes,
      edges: current_edges
    };

    main.addNewNode = function (nipype_interface) {
      var y = 150* next_node_id;
      var x = 50 * next_node_id;
      console.log(y);
      main.model.nodes[next_node_id] = {
        id: next_node_id,
        x: x,
        y: y,
        interface: nipype_interface
      };
      next_node_id++;
      localStorageService.set('model', main.model);
    };

    main.changeNodePosition = function (nodeID, newX, newY) {
      main.model.nodes[nodeID].x = newX;
      main.model.nodes[nodeID].y = newY;
    };

    main.addNewEdge = function (out_node, outlet, in_node, inlet, startPoint, endPoint) {
      main.model.edges[next_edge_id] = {
        id: next_edge_id,
        out_node: out_node,
        outlet: outlet,
        in_node: in_node,
        inlet: inlet,
        startPoint: startPoint,
        endPoint: endPoint
      };
      next_edge_id++;
    };






  }
})();
