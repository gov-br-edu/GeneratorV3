import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FormInput } from './components/FormInput';
import { CardFront, CardBack } from './components/IDCard';
import { INITIAL_DATA, StudentData } from './types';
import { UploadIcon, CameraIcon, PrinterIcon, RefreshCwIcon } from './components/Icons';

function App() {
  const [formData, setFormData] = useState<StudentData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados?')) {
        setFormData({
            fullName: '',
            course: '',
            admissionDate: '',
            validityDate: '',
            fatherName: '',
            motherName: '',
            cpf: '',
            rg: '',
            birthDate: '',
            birthPlace: '',
            photoUrl: null,
            matricula: '',
        });
    }
  };

  const handleDownloadPDF = async () => {
    const frontElement = document.getElementById('card-front');
    const backElement = document.getElementById('card-back');

    if (!frontElement || !backElement) return;

    setIsGenerating(true);

    try {
        // Wait for images to render
        await new Promise(resolve => setTimeout(resolve, 500));

        // Options for html2canvas
        const options = {
            scale: 4, // High scale for crisp printing
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false
        };

        // Capture Front
        const frontCanvas = await html2canvas(frontElement, options);
        const frontImgData = frontCanvas.toDataURL('image/png');

        // Capture Back
        const backCanvas = await html2canvas(backElement, options);
        const backImgData = backCanvas.toDataURL('image/png');

        // Setup Custom PDF Page Size
        // Instead of A4, we use a custom size that fits the cards perfectly.
        // We slightly increase the physical width to 90mm (vs standard 85.6mm) 
        // to address the "too small" concern while maintaining aspect ratio.
        
        const cardWidth = 90; 
        const aspectRatio = 400 / 252; // Based on the HTML element dimensions
        const cardHeight = cardWidth / aspectRatio; // approx 56.7mm
        
        const margin = 10; // Small margin (10mm)
        const gap = 5; // Gap between front and back images
        
        // Calculate total page size needed
        const pageWidth = cardWidth + (margin * 2);
        const pageHeight = (cardHeight * 2) + gap + (margin * 2) + 10; // +10 for footer text

        // Initialize PDF with custom size
        const doc = new jsPDF('p', 'mm', [pageWidth, pageHeight]);
        
        // Add Header text
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Carteirinha Estudantil", margin, margin - 3);

        // Add Front Image
        doc.addImage(frontImgData, 'PNG', margin, margin, cardWidth, cardHeight);
        
        // Add Back Image (below front)
        doc.addImage(backImgData, 'PNG', margin, margin + cardHeight + gap, cardWidth, cardHeight);
        
        // Add footer text
        doc.setFontSize(8);
        doc.text("Recorte nas linhas indicadas.", margin, margin + (cardHeight * 2) + gap + 5);

        // Save PDF
        const filename = `carteirinha-${formData.fullName.replace(/\s+/g, '-').toLowerCase() || 'estudante'}.pdf`;
        doc.save(filename);

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Ocorreu um erro ao gerar o PDF. Se a imagem do QR Code não aparecer, pode ser um bloqueio do servidor da imagem.");
    } finally {
        setIsGenerating(false);
    }
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 font-sans">
      
      {/* Header - No print */}
      <header className="w-full max-w-6xl px-4 mb-8 no-print">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-green-600 text-white p-1 rounded">IF</span>
            Gerador de Carteirinha
        </h1>
        <p className="text-gray-500 text-sm mt-1">Preencha os dados abaixo para gerar a identificação estudantil.</p>
      </header>

      {/* Main Layout */}
      <div className="w-full max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Left Column: Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 no-print">
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">MAKE BY D҉Z҉N҉</p>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Dados da Identidade Estudantil</h2>
            
            <div className="flex flex-col items-center mb-8 relative">
                <div 
                    onClick={triggerPhotoUpload}
                    className={`w-32 h-32 rounded-full border-4 cursor-pointer relative overflow-hidden group transition-all ${formData.photoUrl ? 'border-green-500' : 'border-gray-200 hover:border-green-400'}`}
                >
                    {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                            <CameraIcon className="w-10 h-10 mb-1" />
                        </div>
                    )}
                    
                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <UploadIcon className="text-white w-8 h-8" />
                    </div>
                </div>
                
                {/* Blue upload button badge */}
                <button 
                    onClick={triggerPhotoUpload}
                    className="absolute bottom-6 right-[35%] translate-x-10 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <UploadIcon className="w-4 h-4" />
                </button>
                
                <span className="mt-2 text-sm font-medium text-gray-600">Foto do Aluno</span>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    className="hidden" 
                />
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        label="Nome Completo" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        placeholder="Ex: João da Silva" 
                        className="md:col-span-2"
                    />
                    
                    <FormInput 
                        label="Curso" 
                        name="course" 
                        value={formData.course} 
                        onChange={handleInputChange} 
                        placeholder="Ex: Bacharelado em Agronomia" 
                        className="md:col-span-2"
                    />

                    <FormInput 
                        label="Matrícula" 
                        name="matricula" 
                        value={formData.matricula} 
                        onChange={handleInputChange} 
                        placeholder="00000000000" 
                    />

                    <FormInput 
                        label="Ingresso (MM/AAAA)" 
                        name="admissionDate" 
                        value={formData.admissionDate} 
                        onChange={handleInputChange} 
                        placeholder="02/2023" 
                    />

                    <FormInput 
                        label="Validade (MM/AAAA)" 
                        name="validityDate" 
                        value={formData.validityDate} 
                        onChange={handleInputChange} 
                        placeholder="12/2026" 
                        className="md:col-span-2"
                    />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <FormInput 
                        label="Nome do Pai" 
                        name="fatherName" 
                        value={formData.fatherName} 
                        onChange={handleInputChange} 
                        placeholder="" 
                        className="mb-4"
                    />
                    
                    <FormInput 
                        label="Nome da Mãe" 
                        name="motherName" 
                        value={formData.motherName} 
                        onChange={handleInputChange} 
                        placeholder="" 
                        className="mb-4"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                         <FormInput 
                            label="CPF" 
                            name="cpf" 
                            value={formData.cpf} 
                            onChange={handleInputChange} 
                            placeholder="000.000.000-00" 
                        />
                         <FormInput 
                            label="RG" 
                            name="rg" 
                            value={formData.rg} 
                            onChange={handleInputChange} 
                            placeholder="MG-00.000.000" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <FormInput 
                        label="Data de Nascimento" 
                        name="birthDate" 
                        value={formData.birthDate} 
                        onChange={handleInputChange} 
                        placeholder="dd/mm/aaaa" 
                    />
                    <FormInput 
                        label="Naturalidade" 
                        name="birthPlace" 
                        value={formData.birthPlace} 
                        onChange={handleInputChange} 
                        placeholder="Cidade - UF" 
                    />
                </div>

            </div>
        </div>

        {/* Right Column: Preview */}
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800 no-print">Pré-visualização</h2>
            
            {/* Printable Area Wrapper */}
            <div id="printable-area" className="flex flex-col items-center gap-8 p-4 bg-white rounded-lg">
                 <CardFront data={formData} />
                 <CardBack data={formData} />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mt-4 no-print">
                <button 
                    onClick={handleClear}
                    className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
                >
                    <RefreshCwIcon className="w-5 h-5" />
                    Limpar
                </button>
                <button 
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Gerando PDF...
                        </>
                    ) : (
                        <>
                            <PrinterIcon className="w-5 h-5" />
                            Baixar PDF
                        </>
                    )}
                </button>
            </div>
            
            <p className="text-center text-gray-400 text-xs mt-2 no-print">
                Preencha os dados no formulário para ver o resultado em tempo real.
            </p>
        </div>

      </div>
    </div>
  );
}

export default App;