import { useState } from 'react'
import { Link } from 'react-router-dom'

function KycUpload() {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<Record<string, File | null>>({
    aadharFront: null,
    aadharBack: null,
    pan: null,
    selfie: null
  })
  const [aadharNumber, setAadharNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleFile = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFiles({ ...files, [key]: e.target.files[0] })
    }
  }

  const handleSubmit = () => setSubmitted(true)

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">KYC Submitted!</h2>
          <p className="text-gray-500 mb-6">Your documents are under review. We will verify within 24 hours and notify you by email.</p>
          <Link to="/provider/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/provider/dashboard" className="text-gray-500 hover:text-blue-600">← Back</Link>
              <div className="w-px h-5 bg-gray-200" />
              <span className="font-black text-gray-900">KYC Verification</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Progress */}
        <div className="flex items-center space-x-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Aadhar Card</h2>
              <p className="text-gray-500 text-sm mb-6">Upload clear photos of front and back of your Aadhar card</p>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">Aadhar Number</label>
                <input
                  value={aadharNumber}
                  onChange={e => setAadharNumber(e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { key: 'aadharFront', label: 'Front Side' },
                  { key: 'aadharBack', label: 'Back Side' }
                ].map(item => (
                  <label key={item.key} className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    files[item.key] ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                  }`}>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(item.key, e)} />
                    <div className="text-3xl mb-2">{files[item.key] ? '✅' : '📷'}</div>
                    <p className="font-bold text-gray-700 text-sm">{item.label}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {files[item.key] ? (files[item.key] as File).name : 'Click to upload'}
                    </p>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!aadharNumber || !files.aadharFront || !files.aadharBack}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">PAN Card</h2>
              <p className="text-gray-500 text-sm mb-6">Upload a clear photo of your PAN card</p>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">PAN Number</label>
                <input
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold tracking-widest"
                />
              </div>

              <label className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer mb-6 transition-all ${
                files.pan ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
              }`}>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFile('pan', e)} />
                <div className="text-4xl mb-3">{files.pan ? '✅' : '📄'}</div>
                <p className="font-bold text-gray-700">{files.pan ? (files.pan as File).name : 'Click to upload PAN card'}</p>
                <p className="text-gray-400 text-sm mt-1">JPG, PNG up to 5MB</p>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-black hover:bg-gray-200 transition-all">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!panNumber || !files.pan}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Selfie Verification</h2>
              <p className="text-gray-500 text-sm mb-6">Take a clear selfie holding your Aadhar card</p>

              <label className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer mb-6 transition-all ${
                files.selfie ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
              }`}>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFile('selfie', e)} />
                <div className="text-4xl mb-3">{files.selfie ? '✅' : '🤳'}</div>
                <p className="font-bold text-gray-700">{files.selfie ? (files.selfie as File).name : 'Click to take/upload selfie'}</p>
                <p className="text-gray-400 text-sm mt-1">Hold your Aadhar card clearly visible</p>
              </label>

              <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border border-yellow-100">
                <p className="text-yellow-800 text-sm font-semibold">📋 Checklist before submitting:</p>
                <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                  <li>✓ Aadhar front and back uploaded</li>
                  <li>✓ PAN card uploaded</li>
                  <li>✓ Selfie with Aadhar card</li>
                  <li>✓ All documents are clear and readable</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-black hover:bg-gray-200 transition-all">
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!files.selfie}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-black hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  Submit KYC ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KycUpload