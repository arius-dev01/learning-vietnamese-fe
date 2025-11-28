import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAddQuestion } from '../../hooks/useAddQuestion';
import { useQueryLesson } from '../../hooks/useLesson';
import { importQuestionExcelAR, importQuestionExcelLC, importQuestionExcelMC } from '../../service/questionService';
import { Question } from '../../types/Question';

interface AdminImportExcelModalQProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'MC' | 'LS' | 'AS';
}

export default function AdminImportExcelModalQ({ isOpen, onClose, mode }: AdminImportExcelModalQProps) {
  const [formData, setFormData] = useState<Question[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useQueryLesson();
  const [error, setError] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const { mutateAsync: mutateAddQuestion } = useAddQuestion();

  if (!isOpen) return null;

  const getModeTitle = () => {
    switch (mode) {
      case 'MC': return 'Multiple Choice';
      case 'LS': return 'Listening';
      case 'AS': return 'Arrange';
      default: return 'Question';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'MC': return 'blue';
      case 'LS': return 'green';
      case 'AS': return 'purple';
      default: return 'gray';
    }
  };

  const handleImportExcel = async (selectedFile: File) => {
    if (!selectedFile) return;

    setIsLoading(true);
    setFile(selectedFile);
    setError('');

    try {
      let res;
      if (mode === 'MC') {
        res = await importQuestionExcelMC(selectedFile);
      } else if (mode === 'LS') {
        res = await importQuestionExcelLC(selectedFile);
      } else {
        res = await importQuestionExcelAR(selectedFile);
      }
      setFormData(res.data);
      console.log('Imported questions:', res.data);
    } catch (error: any) {
      console.error('Import failed:', error);
      setError(error.response?.data?.message || 'Failed to import Excel file. Please check the format.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (typeGame: string) => {
    try {
      if (formData.length === 0) return;
      if (!selectedLessonId) {
        toast.error('Please select a lesson before submitting.');
        return;
      }
      console.log('Submitting questions:', formData);
      console.log('Selected Lesson ID:', selectedLessonId);
      console.log('Game Type:', typeGame);
      await mutateAddQuestion({ gameType: typeGame, lessonId: selectedLessonId, questions: formData });
      toast.success(`Successfully added ${formData.length} questions.`);
      setFormData([]);
      setFile(null);
      setError('');
      onClose();
    } catch (error: any) {
      console.error('Submit failed:', error);
    }
  }
  const renderQuestionPreview = (question: Question, index: number) => {
    const color = getModeColor();

    return (
      <div key={index} className={`p-4 border border-${color}-200 rounded-lg bg-${color}-50`}>
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
          <span className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800`}>
            {mode}
          </span>
        </div>

        <div className="space-y-3 text-sm">


          {mode === 'MC' && (
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Question English: {question.questionText}</p>
              <p className="font-medium text-gray-700">Question Japan: {question.questionTextJa}</p>
              {question.options.map((opt, idx) => (
                <div key={idx} className={`p-2 rounded border ${opt.correct
                  ? 'bg-green-100 border-green-300'
                  : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt.content}
                    </span>
                    {opt.correct && (
                      <span className="text-green-600 text-xs font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Correct
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {mode === 'LS' && (
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Question: {question.questionText}</p>
              {question.options.map((opt, idx) => (
                <div key={idx} className={`p-2 rounded border ${opt.correct
                  ? 'bg-green-100 border-green-300'
                  : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt.content}
                    </span>
                    {opt.correct && (
                      <span className="text-green-600 text-xs font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Correct
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {mode == "AS" && (
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded border">
                <span className="text-gray-600">Sentence: </span>
                <span className="font-medium">{question.sentence}</span>
              </div>
            </div>
          )}

          {question.explanation && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 flex flex-col">
                <span className="font-medium">Explanation English: </span>
                {question.explanation}
                <span className="font-medium">Explanation Japan: </span>
                {question.explanationJa}
              </p>
            </div>
          )}


        </div>
      </div>
    );
  };

  const renderFormatGuide = () => {
    const color = getModeColor();
    const WarningBanner = () => (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="text-sm text-yellow-800">
          <p className="font-semibold">⚠️ Important Note:</p>
          <p>Data will be read starting from <strong>row 2 onwards</strong> (header row 1 will be skipped)</p>
        </div>
      </div>
    );
    switch (mode) {
      case 'MC':
        return (
          <div className={`p-4 bg-${color}-50 border border-${color}-200 rounded-lg`}>
            <h4 className={`font-medium text-${color}-800 mb-3 flex items-center`}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Format Excel cho Multiple Choice
            </h4>
            <div className={`text-sm text-${color}-700 space-y-2`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Column A:</strong> questionTextEN</p>
                  <p><strong>Column B:</strong> explore EN</p>
                  <p><strong>Column C:</strong> questionTextJA</p>
                  <p><strong>Column D:</strong> explore JA</p>
                  <p><strong>Column E:</strong> option_a</p>
                </div>
                <div>
                  <p><strong>Column F:</strong> option_B</p>
                  <p><strong>Column G:</strong> option_C</p>
                  <p><strong>Column H:</strong> option_D</p>
                  <p><strong>Column I:</strong> correct_answer (A/B/C/D)</p>
                </div>
                <WarningBanner />
              </div>
            </div>

          </div>
        );

      case 'LS':
        return (
          <div className={`p-4 bg-${color}-50 border border-${color}-200 rounded-lg`}>
            <h4 className={`font-medium text-${color}-800 mb-3 flex items-center`}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"
                  clipRule="evenodd"
                />
              </svg>
              Format Excel cho Listening
            </h4>

            <div className={`text-sm text-${color}-700 space-y-2`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Column A:</strong> questionText</p>
                  <p><strong>Column B:</strong> exploreEN</p>
                  <p><strong>Column C:</strong> exploreJA</p>
                  <p><strong>Column D:</strong> option_a</p>
                </div>
                <div>
                  <p><strong>Column E:</strong> option_b</p>
                  <p><strong>Column F:</strong> option_c</p>
                  <p><strong>Column G:</strong> option_d</p>
                  <p><strong>Column H:</strong> option_e</p>
                  <p><strong>Column I:</strong> option_f</p>
                  <p><strong>Column J:</strong> option_g</p>
                  <p><strong>Column K:</strong> correct_answer (A/B/C/D)</p>
                </div>
                <WarningBanner />

              </div>
            </div>

          </div>
        );


      case 'AS':
        return (
          <div className={`p-4 bg-${color}-50 border border-${color}-200 rounded-lg`}>
            <h4 className={`font-medium text-${color}-800 mb-3 flex items-center`}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Format Excel cho Arrange
            </h4>
            <div className={`text-sm text-${color}-700 space-y-2`}>
              <p><strong>Column A:</strong> sentence</p>
              <p><strong>Column B:</strong> exploreEN</p>
              <p><strong>Column C:</strong> exploreJA</p>

              <div className="mt-2 p-2 bg-white rounded border">
                <p className="text-xs font-medium">Example:</p>
                <p className="text-xs">Tôi đang ăn sáng</p>
              </div>
              <WarningBanner />

            </div>

          </div>
        );
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='max-w-6xl w-full mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50'>
          <div className='flex items-center space-x-3'>
            <div className={`w-3 h-3 rounded-full bg-${getModeColor()}-500`}></div>
            <h1 className='text-xl font-bold text-gray-800'>
              Import {getModeTitle()} Questions
            </h1>
            {formData.length > 0 && (
              <span className={`px-3 py-1 text-sm rounded-full bg-${getModeColor()}-100 text-${getModeColor()}-800`}>
                {formData.length} questions loaded
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setFormData([]);
              setFile(null);
              setError('');
              setSelectedLessonId(null);
              onClose();
            }}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto'>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div className="space-y-6">
              {formData.length === 0 && renderFormatGuide()}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Import Error</h3>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className='space-y-6'>
                <div className='space-y-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Select Lesson:
                  </label>
                  <select
                    value={selectedLessonId || ''}
                    onChange={(e) => setSelectedLessonId(e.target.value ? Number(e.target.value) : null)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0  text-sm'
                  >
                    <option value="">Choose a lesson...</option>
                    {data?.lesson && data.lesson.filter(lesson => lesson.gameCount < 3 && !lesson.typeGames?.includes(mode)).map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    ))}
                  </select>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Upload Excel File
                  </h3>

                  <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isLoading
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImportExcel(e.target.files[0]);
                        }
                      }}
                      className='hidden'
                      id='file-upload'
                      disabled={isLoading}
                    />
                    <label htmlFor='file-upload' className={`cursor-pointer ${isLoading ? 'cursor-not-allowed' : ''}`}>
                      <div className='flex flex-col items-center space-y-3'>
                        {isLoading ? (
                          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        )}
                        <div>
                          <p className='text-lg font-medium text-gray-700'>
                            {isLoading ? 'Processing...' : file ? file.name : 'Click to upload Excel file'}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {isLoading ? 'Please wait while we process your file' : 'Support .xlsx and .xls files'}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {file && !isLoading && (
                    <div className='flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg'>
                      <div className='flex items-center space-x-3'>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-green-800'>{file.name}</p>
                          <p className='text-xs text-green-600'>File uploaded successfully</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFile(null);
                          setFormData([]);
                          setError('');
                        }}
                        className='p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors'
                        title="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  )}

                  {formData.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-blue-800">
                          {formData.length} questions imported successfully
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formData.length > 0 && (
              <div className="space-y-4">
                <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Questions Preview
                </h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {formData.map((question, index) => renderQuestionPreview(question, index))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50'>
          <div className="text-sm text-gray-600">
            {formData.length > 0 && `Ready to save ${formData.length} questions`}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className='px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
            >
              Cancel
            </button>
            <button
              disabled={formData.length === 0 || isLoading || selectedLessonId === null}
              onClick={() => handleSubmit(mode)}
              className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${formData.length > 0 && !isLoading
                ? `bg-${getModeColor()}-600 hover:bg-${getModeColor()}-700`
                : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {isLoading ? 'Processing...' : `Save ${formData.length} Questions`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}