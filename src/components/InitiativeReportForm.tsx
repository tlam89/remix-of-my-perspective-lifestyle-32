import React, { useState } from 'react';
import { Plus, Trash2, Save, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TrialUnit {
  id: number;
  name: string;
  address: string;
  field: string;
}

interface InitiativeFormState {
  introduction: string;
  initiativeName: string;
  applicationField: string;
  currentStatus: string;
  purpose: string;
  solutionContent: string;
  implementationSteps: string;
  conditions: string;
  trialUnits: TrialUnit[];
  novelty: string;
  effectiveness: {
    economic: string;
    social: string;
    teaching: string;
    productivity: string;
    quality: string;
    environment: string;
    safety: string;
  };
  confidentialInfo: string;
  submissionDate: string;
  authorName: string;
}

interface InitiativeReportFormProps {
  onVerify?: (fieldName: string, content: string) => void;
  readOnly?: boolean;       // Editor & Admin: view only
  showVerifyButton?: boolean; // Only Admin can see verify button
}

const initialFormState: InitiativeFormState = {
  introduction: '',
  initiativeName: '',
  applicationField: '',
  currentStatus: '',
  purpose: '',
  solutionContent: '',
  implementationSteps: '',
  conditions: '',
  trialUnits: [],
  novelty: '',
  effectiveness: {
    economic: '',
    social: '',
    teaching: '',
    productivity: '',
    quality: '',
    environment: '',
    safety: '',
  },
  confidentialInfo: '',
  submissionDate: new Date().toISOString().split('T')[0],
  authorName: '',
};

export default function InitiativeReportForm({ onVerify, readOnly = false, showVerifyButton = false }: InitiativeReportFormProps) {
  const [formData, setFormData] = useState<InitiativeFormState>(initialFormState);

  const handleInputChange = (field: keyof InitiativeFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEffectivenessChange = (metric: keyof typeof formData.effectiveness, value: string) => {
    setFormData((prev) => ({
      ...prev,
      effectiveness: { ...prev.effectiveness, [metric]: value },
    }));
  };

  const addTrialUnit = () => {
    const newUnit: TrialUnit = { id: Date.now(), name: '', address: '', field: '' };
    setFormData((prev) => ({ ...prev, trialUnits: [...prev.trialUnits, newUnit] }));
  };

  const updateTrialUnit = (id: number, field: keyof TrialUnit, value: string) => {
    setFormData((prev) => ({
      ...prev,
      trialUnits: prev.trialUnits.map((unit) => (unit.id === id ? { ...unit, [field]: value } : unit)),
    }));
  };

  const removeTrialUnit = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      trialUnits: prev.trialUnits.filter((unit) => unit.id !== id),
    }));
  };

  const handleVerify = (fieldName: string, content: string) => {
    if (onVerify && content.trim()) {
      onVerify(fieldName, content);
    }
  };

  const VerifyButton = ({ fieldName, content }: { fieldName: string; content: string }) => {
    if (!showVerifyButton) return null;
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2 gap-1 text-xs"
        onClick={() => handleVerify(fieldName, content)}
        disabled={!content.trim()}
      >
        <CheckCircle2 size={14} />
        Kiểm tra
      </Button>
    );
  };

  return (
    <Card className="border-border shadow-lg">
      {/* Header */}
      {/* <CardHeader className="bg-primary text-primary-foreground text-center rounded-t-lg">
        <CardTitle className="text-2xl font-bold uppercase tracking-wide">
          Báo Cáo Mô Tả Sáng Kiến
        </CardTitle>
        <p className="text-sm opacity-80 mt-2">Mẫu đơn đăng ký xét công nhận sáng kiến</p>
      </CardHeader> */}

      <div className="text-center mt-6">
          <CardTitle className="text-2xl font-bold uppercase mb-2">
            Báo Cáo Mô Tả Sáng Kiến
          </CardTitle>
      </div>

      <CardContent className="p-6 md:p-8 space-y-8">
        {/* Section 1: Introduction & Basic Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">1-3</span> 
            Thông Tin Chung
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">2. Tên sáng kiến</label>
            <Input
              placeholder="Nhập tên quy trình, giải pháp..."
              value={formData.initiativeName}
              onChange={(e) => handleInputChange('initiativeName', e.target.value)}
              disabled={readOnly}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">3. Lĩnh vực áp dụng</label>
            <Input
              placeholder="Ví dụ: Quản lý giáo dục, Cải cách hành chính..."
              value={formData.applicationField}
              onChange={(e) => handleInputChange('applicationField', e.target.value)}
              disabled={readOnly}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">1. Mở đầu (Sự cần thiết)</label>
            <Textarea
              className="min-h-32"
              placeholder="Giới thiệu vấn đề, khó khăn, bất cập hiện tại..."
              value={formData.introduction}
              onChange={(e) => handleInputChange('introduction', e.target.value)}
              disabled={readOnly}
            />
            <VerifyButton fieldName="Mở đầu (Sự cần thiết)" content={formData.introduction} />
          </div>
        </section>

        {/* Section 4: Description */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">4</span> 
            Mô Tả Sáng Kiến
          </h2>
          
          <div className="bg-accent/50 p-4 rounded-md border border-accent">
            <label className="block text-sm font-bold text-foreground mb-1">
              4.1 Tình trạng trước khi có sáng kiến
            </label>
            <p className="text-xs text-muted-foreground mb-2">Phân tích ưu nhược điểm của giải pháp cũ.</p>
            <Textarea
              className="min-h-24"
              value={formData.currentStatus}
              onChange={(e) => handleInputChange('currentStatus', e.target.value)}
              disabled={readOnly}
            />
            <VerifyButton fieldName="Tình trạng trước khi có sáng kiến" content={formData.currentStatus} />
          </div>
          
          <div className="space-y-4">
            <label className="block text-lg font-medium text-foreground">4.2 Nội dung giải pháp mới</label>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Mục đích (Vấn đề cần giải quyết)</label>
                <Input
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground">Các bước thực hiện giải pháp</label>
                <Textarea
                  className="min-h-32"
                  placeholder="Mô tả ngắn gọn, đầy đủ các bước..."
                  value={formData.implementationSteps}
                  onChange={(e) => handleInputChange('implementationSteps', e.target.value)}
                  disabled={readOnly}
                />
                <VerifyButton fieldName="Các bước thực hiện giải pháp" content={formData.implementationSteps} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground">Điều kiện cần thiết để áp dụng</label>
                <Input
                  value={formData.conditions}
                  onChange={(e) => handleInputChange('conditions', e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-foreground">Danh sách đơn vị/cá nhân áp dụng thử</label>
              {!readOnly && (
                <Button
                  type="button"
                  onClick={addTrialUnit}
                  size="sm"
                  className="gap-1"
                >
                  <Plus size={16} /> Thêm đơn vị
                </Button>
              )}
            </div>
            
            <div className="overflow-x-auto border border-border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">TT</TableHead>
                    <TableHead>Tên tổ chức/Cá nhân</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Lĩnh vực</TableHead>
                    <TableHead className="w-16 text-center">Xóa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.trialUnits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground italic py-4">
                        Chưa có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                  {formData.trialUnits.map((unit, index) => (
                    <TableRow key={unit.id}>
                      <TableCell className="text-sm">{index + 1}</TableCell>
                      <TableCell>
                        <Input 
                          className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                          value={unit.name}
                          onChange={(e) => updateTrialUnit(unit.id, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                          value={unit.address}
                          onChange={(e) => updateTrialUnit(unit.id, 'address', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                          value={unit.field}
                          onChange={(e) => updateTrialUnit(unit.id, 'field', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeTrialUnit(unit.id)} 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Section: Evaluation & Metrics */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">5-6</span> 
            Đánh Giá Hiệu Quả
          </h2>
          
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Tính mới của sáng kiến</label>
            <Textarea
              className="min-h-20"
              placeholder="Điểm khác biệt so với giải pháp cũ..."
              value={formData.novelty}
              onChange={(e) => handleInputChange('novelty', e.target.value)}
            />
            <VerifyButton fieldName="Tính mới của sáng kiến" content={formData.novelty} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-muted/50 p-4 rounded">
              <label className="block text-sm font-bold text-green-600 dark:text-green-400 mb-1">
                Hiệu quả Kinh tế
              </label>
              <Textarea
                className="min-h-20 text-sm"
                placeholder="Số tiền làm lợi, chi phí giảm được (kèm cách tính)..."
                value={formData.effectiveness.economic}
                onChange={(e) => handleEffectivenessChange('economic', e.target.value)}
              />
              <VerifyButton fieldName="Hiệu quả Kinh tế" content={formData.effectiveness.economic} />
            </div>
            
            <div className="bg-muted/50 p-4 rounded">
              <label className="block text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">
                Hiệu quả Công việc/Giảng dạy
              </label>
              <Textarea
                className="min-h-20 text-sm"
                placeholder="Tăng năng suất, hiệu quả giảng dạy (số liệu cụ thể)..."
                value={formData.effectiveness.teaching}
                onChange={(e) => handleEffectivenessChange('teaching', e.target.value)}
              />
              <VerifyButton fieldName="Hiệu quả Công việc/Giảng dạy" content={formData.effectiveness.teaching} />
            </div>
            
            <div className="bg-muted/50 p-4 rounded">
              <label className="block text-sm font-bold text-teal-600 dark:text-teal-400 mb-1">
                Môi trường & An toàn
              </label>
              <Textarea
                className="min-h-20 text-sm"
                placeholder="Cải thiện điều kiện làm việc, an toàn lao động..."
                value={formData.effectiveness.safety}
                onChange={(e) => handleEffectivenessChange('safety', e.target.value)}
              />
              <VerifyButton fieldName="Môi trường & An toàn" content={formData.effectiveness.safety} />
            </div>
            
            <div className="bg-muted/50 p-4 rounded">
              <label className="block text-sm font-bold text-purple-600 dark:text-purple-400 mb-1">
                Nhận thức & Xã hội
              </label>
              <Textarea
                className="min-h-20 text-sm"
                placeholder="Nâng cao trình độ, nhận thức..."
                value={formData.effectiveness.social}
                onChange={(e) => handleEffectivenessChange('social', e.target.value)}
              />
              <VerifyButton fieldName="Nhận thức & Xã hội" content={formData.effectiveness.social} />
            </div>
          </div>
        </section>

        {/* Footer & Signatures */}
        <section className="border-t border-border pt-6 mt-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-destructive mb-1">
              6. Thông tin cần bảo mật (nếu có)
            </label>
            <Input
              className="border-destructive/30 bg-destructive/5"
              value={formData.confidentialInfo}
              onChange={(e) => handleInputChange('confidentialInfo', e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-8">
            <div className="text-center w-full md:w-1/3">
              <p className="font-bold uppercase mb-16 text-foreground">Lãnh đạo đơn vị</p>
              <div className="border-t border-border w-48 mx-auto pt-2 text-sm text-muted-foreground">
                (Ký, ghi rõ họ tên)
              </div>
            </div>
            
            <div className="text-center w-full md:w-1/3">
              <p className="italic mb-2 text-foreground">
                Tp. Hồ Chí Minh, ngày{' '}
                <Input 
                  type="date" 
                  className="inline-block w-auto" 
                  value={formData.submissionDate} 
                  onChange={(e) => handleInputChange('submissionDate', e.target.value)} 
                />
              </p>
              <p className="font-bold uppercase mb-16 text-foreground">Tác giả sáng kiến</p>
              <Input 
                placeholder="Nhập họ tên tác giả"
                className="text-center border-0 border-b rounded-none focus-visible:ring-0"
                value={formData.authorName}
                onChange={(e) => handleInputChange('authorName', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button variant="outline" className="gap-2">
            <FileText size={18} /> Xuất PDF
          </Button>
          <Button className="gap-2 shadow-lg">
            <Save size={18} /> Lưu Báo Cáo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
