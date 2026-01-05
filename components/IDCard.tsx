import React from 'react';
import { StudentData } from '../types';
import { IFLogo, BarcodePlaceholder, QRCodeImage } from './Icons';

interface IDCardProps {
  data: StudentData;
}

// 85.6mm x 53.98mm aspect ratio approx 1.58
// Using a fixed width for the preview, scaling via CSS if needed.
// Base width: 400px, Height: ~252px

export const CardFront: React.FC<IDCardProps> = ({ data }) => {
  return (
    <div id="card-front" className="w-[400px] h-[252px] bg-gray-100 relative overflow-hidden shadow-lg rounded-lg flex-shrink-0 print:shadow-none">
      {/* Background decoration - Green shape top left */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-green-600"></div>
      <div className="absolute top-[80px] left-[80px] w-10 h-10 bg-green-600 transform rotate-45"></div>

      {/* Main White Content Area */}
      <div className="absolute top-[40px] left-[20px] right-0 bottom-0 bg-white shadow-sm z-10 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-2">
            <IFLogo className="w-10 h-12 flex-shrink-0 object-contain" />
            <div className="flex flex-col">
                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-wider leading-tight">Instituto Federal</span>
                <span className="text-[10px] font-bold text-gray-800 uppercase leading-tight">De Educação, Ciência e Tecnologia</span>
                <span className="text-[10px] text-gray-600 leading-tight">Triângulo Mineiro</span>
            </div>
        </div>

        {/* Content Body */}
        <div className="flex px-6 pt-2 h-full relative">
            {/* Photo Area (Floating Left slightly outside this container visually in the reference, but we keep inside for structure) */}
            <div className="w-24 h-32 bg-gray-200 flex-shrink-0 border-4 border-white shadow-sm -ml-8 -mt-4 relative z-20">
                {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Student" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                        SUA FOTO AQUI
                    </div>
                )}
            </div>

            {/* Text Details */}
            <div className="flex flex-col flex-grow pl-4 pt-1 space-y-2">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Nome</span>
                    {/* Fixed: Added leading-normal and pb-1 to prevent html2canvas clipping text */}
                    <span className="text-xs font-bold text-gray-900 uppercase truncate leading-normal pb-1 w-56">
                        {data.fullName || "NOME DO ESTUDANTE"}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Curso</span>
                    <span className="text-[10px] font-bold text-gray-900 uppercase leading-tight w-48">
                        {data.course || "CURSO DO ALUNO"}
                    </span>
                </div>

                <div className="flex gap-4">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-gray-500 uppercase">Matrícula</span>
                        <span className="text-[10px] text-gray-800">{data.matricula}</span>
                     </div>
                     
                     <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-gray-500 uppercase">Ingresso</span>
                        <span className="text-[10px] text-gray-800">{data.admissionDate || "MM/YYYY"}</span>
                     </div>
                </div>

                <div className="flex justify-end items-end mt-auto w-full">
                     <div className="flex flex-col items-center relative -right-6 bottom-4">
                         {/* Red Validity Box */}
                         <div className="bg-[#cc3333] text-white px-3 py-1 flex flex-col items-center justify-center shadow-md w-28">
                            <span className="text-[8px] font-medium opacity-90">VALIDADE</span>
                            <span className="text-sm font-bold">{data.validityDate || "MM/YYYY"}</span>
                         </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Bottom Text */}
      <div className="absolute bottom-4 left-8 z-20">
         <span className="text-xs font-extrabold text-gray-700 uppercase tracking-tighter">Identidade Estudantil</span>
      </div>
    </div>
  );
};

export const CardBack: React.FC<IDCardProps> = ({ data }) => {
  return (
    <div id="card-back" className="w-[400px] h-[252px] bg-gray-100 relative overflow-hidden shadow-lg rounded-lg flex-shrink-0 print:shadow-none flex">
        {/* Left Content (White) */}
        <div className="flex-grow bg-[#eeeeee] p-5 flex flex-col justify-between relative">
            
            <div className="space-y-2 z-10">
                {/* Name */}
                <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-500 uppercase">Nome</span>
                    {/* Fixed: Added leading-normal and pb-1 to prevent html2canvas clipping text */}
                    <span className="text-[10px] font-bold text-gray-900 uppercase truncate leading-normal pb-1">
                        {data.fullName || "SEU NOME COMPLETO"}
                    </span>
                </div>

                {/* Filiação */}
                <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-500 uppercase">Filiação</span>
                    <span className="text-[9px] font-medium text-gray-800 uppercase leading-tight">
                        {data.fatherName || "NOME DO PAI"}
                    </span>
                    <span className="text-[9px] font-medium text-gray-800 uppercase leading-tight">
                        {data.motherName || "NOME DA MÃE"}
                    </span>
                </div>

                {/* Docs Row */}
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-gray-500 uppercase">CPF</span>
                        <span className="text-[9px] font-medium text-gray-800">{data.cpf || "000.000.000-00"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-gray-500 uppercase">RG</span>
                        <span className="text-[9px] font-medium text-gray-800">{data.rg || "MG-00.000.000"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-gray-500 uppercase">Data Nasc.</span>
                        <span className="text-[9px] font-medium text-gray-800">{data.birthDate || "00/00/0000"}</span>
                    </div>
                </div>

                 {/* Naturalidade Row */}
                 <div className="flex flex-col mt-1">
                        <span className="text-[8px] font-bold text-gray-500 uppercase">Naturalidade</span>
                        <span className="text-[9px] font-medium text-gray-800 uppercase">{data.birthPlace || "CIDADE - UF"}</span>
                </div>
            </div>

            {/* Signature Area */}
            <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
                 <img src="https://i.ibb.co/3gRp48y/1767562186084.png" alt="Assinatura" className="h-12 object-contain mb-1" crossOrigin="anonymous" />
                 <div className="w-48 border-t border-gray-400"></div>
                 <span className="text-[7px] font-bold text-gray-600 mt-1">Deborah Santesso Bonnas</span>
                 <span className="text-[7px] text-gray-600">Reitora do IFTM</span>
            </div>

            {/* Barcode */}
            <div className="h-10 w-full mt-auto bg-white p-1">
                <BarcodePlaceholder />
            </div>

        </div>

        {/* Right Sidebar (Green) */}
        <div className="w-24 bg-[#2d8e48] flex flex-col items-center py-6 px-2 justify-between flex-shrink-0">
             <div className="flex flex-col items-center text-center">
                <IFLogo className="w-10 h-10 mb-2 brightness-0 invert object-contain" />
                <span className="text-[8px] font-bold text-white uppercase leading-tight">Instituto<br/>Federal</span>
                <span className="text-[6px] text-green-100 mt-1 leading-tight">Triângulo Mineiro</span>
                <span className="text-[6px] text-green-100 leading-tight">Campus<br/>Uberlândia</span>
             </div>

             <div className="bg-white p-1 rounded w-16 h-16 mt-4 flex items-center justify-center overflow-hidden">
                <QRCodeImage className="w-full h-full object-contain" />
             </div>
        </div>
    </div>
  );
};
