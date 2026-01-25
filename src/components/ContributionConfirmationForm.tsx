import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Save, FileText, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Participant {
  id: number;
  fullName: string;
  workUnit: string;
  contributionPercent: number;
  isEditing: boolean;
}

interface ContributionFormState {
  initiativeName: string;
  mainAuthor: string;
  position: string;
  representativePercent: number;
  submissionDate: Date;
  participants: Participant[];
  digitalSignatureConfirmed: boolean;
}

interface ContributionConfirmationFormProps {
  onVerify?: (fieldName: string, content: string) => void;
  readOnly?: boolean;       // Editor & Admin: view only
  showVerifyButton?: boolean; // Only Admin can see verify button
}

const initialFormState: ContributionFormState = {
  initiativeName: '',
  mainAuthor: '',
  position: '',
  representativePercent: 0,
  submissionDate: new Date(),
  participants: [],
  digitalSignatureConfirmed: false,
};

export default function ContributionConfirmationForm({ onVerify, readOnly = false, showVerifyButton = false }: ContributionConfirmationFormProps) {
  const [formData, setFormData] = useState<ContributionFormState>(initialFormState);
  const [editingRow, setEditingRow] = useState<Participant | null>(null);

  // Calculate total percentage
  const totalPercent = useMemo(() => {
    return formData.participants.reduce((sum, p) => sum + (p.contributionPercent || 0), 0);
  }, [formData.participants]);

  const isValid = totalPercent === 100;

  // Sync main author as first participant
  useEffect(() => {
    if (formData.mainAuthor && formData.participants.length === 0) {
      const newParticipant: Participant = {
        id: Date.now(),
        fullName: formData.mainAuthor,
        workUnit: formData.position,
        contributionPercent: formData.representativePercent,
        isEditing: false,
      };
      setFormData(prev => ({
        ...prev,
        participants: [newParticipant],
      }));
    } else if (formData.participants.length > 0) {
      // Update first participant when main author info changes
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.map((p, index) => 
          index === 0 
            ? { ...p, fullName: formData.mainAuthor, workUnit: formData.position, contributionPercent: formData.representativePercent }
            : p
        ),
      }));
    }
  }, [formData.mainAuthor, formData.position, formData.representativePercent]);

  const handleInputChange = (field: keyof ContributionFormState, value: string | number | Date | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now(),
      fullName: '',
      workUnit: '',
      contributionPercent: 0,
      isEditing: true,
    };
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
    }));
    setEditingRow(newParticipant);
  };

  const updateParticipant = (id: number, field: keyof Participant, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const removeParticipant = (id: number) => {
    // Prevent removing the first participant (main author)
    if (formData.participants[0]?.id === id) {
      toast.error('Không thể xóa tác giả chính');
      return;
    }
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id),
    }));
  };

  const startEditing = (participant: Participant) => {
    setEditingRow({ ...participant });
    updateParticipant(participant.id, 'isEditing', true);
  };

  const cancelEditing = (id: number) => {
    if (editingRow) {
      // Restore original values
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.map(p => 
          p.id === id ? { ...editingRow, isEditing: false } : p
        ),
      }));
    }
    setEditingRow(null);
  };

  const saveEditing = (id: number) => {
    updateParticipant(id, 'isEditing', false);
    setEditingRow(null);
  };

  const handleSubmit = () => {
    if (!isValid) {
      toast.error('Tổng tỷ lệ đóng góp phải bằng 100%');
      return;
    }
    if (!formData.digitalSignatureConfirmed) {
      toast.error('Vui lòng xác nhận chữ ký số');
      return;
    }
    if (!formData.initiativeName.trim()) {
      toast.error('Vui lòng nhập tên sáng kiến');
      return;
    }
    if (!formData.mainAuthor.trim()) {
      toast.error('Vui lòng nhập tên tác giả chính');
      return;
    }
    toast.success('Đã lưu bản xác nhận thành công!');
  };

  return (
    <Card className="border-border shadow-lg">
      <div className="text-center mt-6 space-y-1">
        <div className="flex justify-center gap-8 text-xs text-muted-foreground mb-4">
          <div>
            <p className="font-semibold">BỘ Y TẾ</p>
            <p className="font-bold text-foreground">ĐẠI HỌC Y DƯỢC</p>
            <p className="font-bold text-foreground">THÀNH PHỐ HỒ CHÍ MINH</p>
          </div>
          <div>
            <p className="font-semibold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold text-foreground">Độc lập – Tự do – Hạnh phúc</p>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold uppercase">
          Bản Xác Nhận
        </CardTitle>
        <p className="text-lg font-semibold text-foreground">
          Tỷ Lệ (%) Đóng Góp Vào Việc Tạo Ra Sáng Kiến
        </p>
      </div>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Section 1: General Information */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">
            Thông Tin Chung
          </h2>

          <div>
            <Label htmlFor="initiativeName" className="text-sm font-medium">
              1. Tên sáng kiến <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="initiativeName"
              placeholder="Nhập tên sáng kiến..."
              className="min-h-20 mt-1"
              value={formData.initiativeName}
              onChange={(e) => handleInputChange('initiativeName', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="mainAuthor" className="text-sm font-medium">
              2. Tác giả chính / Đại diện nhóm tác giả sáng kiến <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mainAuthor"
              placeholder="Nhập họ và tên..."
              className="mt-1"
              value={formData.mainAuthor}
              onChange={(e) => handleInputChange('mainAuthor', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position" className="text-sm font-medium">
                Chức vụ, đơn vị công tác
              </Label>
              <Input
                id="position"
                placeholder="Nhập chức vụ và đơn vị..."
                className="mt-1"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="representativePercent" className="text-sm font-medium">
                Tỷ lệ đóng góp của đại diện (%)
              </Label>
              <Input
                id="representativePercent"
                type="number"
                min={0}
                max={100}
                placeholder="0"
                className="mt-1"
                value={formData.representativePercent || ''}
                onChange={(e) => handleInputChange('representativePercent', Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Ngày nộp</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full md:w-[280px] justify-start text-left font-normal mt-1",
                    !formData.submissionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.submissionDate ? (
                    format(formData.submissionDate, "dd 'tháng' MM 'năm' yyyy", { locale: vi })
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.submissionDate}
                  onSelect={(date) => date && handleInputChange('submissionDate', date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Section 2: Participant Table */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2 flex-1">
              Tỷ Lệ Đóng Góp
            </h2>
            <Button
              type="button"
              onClick={addParticipant}
              size="sm"
              className="gap-1"
            >
              <Plus size={16} /> Thêm thành viên
            </Button>
          </div>

          <div className="overflow-x-auto border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">STT</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Đơn vị công tác</TableHead>
                  <TableHead className="w-32 text-center">% đóng góp</TableHead>
                  <TableHead className="w-24 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.participants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground italic py-8">
                      Nhập thông tin tác giả chính để bắt đầu
                    </TableCell>
                  </TableRow>
                )}
                {formData.participants.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {participant.isEditing ? (
                        <Input
                          className="border-input"
                          value={participant.fullName}
                          onChange={(e) => updateParticipant(participant.id, 'fullName', e.target.value)}
                          disabled={index === 0}
                        />
                      ) : (
                        <span>{participant.fullName || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {participant.isEditing ? (
                        <Input
                          className="border-input"
                          value={participant.workUnit}
                          onChange={(e) => updateParticipant(participant.id, 'workUnit', e.target.value)}
                          disabled={index === 0}
                        />
                      ) : (
                        <span>{participant.workUnit || '-'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {participant.isEditing ? (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          className="border-input text-center w-20 mx-auto"
                          value={participant.contributionPercent || ''}
                          onChange={(e) => updateParticipant(participant.id, 'contributionPercent', Number(e.target.value))}
                          disabled={index === 0}
                        />
                      ) : (
                        <span>{participant.contributionPercent}%</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        {index === 0 ? (
                          <span className="text-xs text-muted-foreground italic">Tác giả chính</span>
                        ) : participant.isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => saveEditing(participant.id)}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => cancelEditing(participant.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <X size={16} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(participant)}
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeParticipant(participant.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    TỔNG CỘNG
                  </TableCell>
                  <TableCell className={cn(
                    "text-center font-bold text-lg",
                    isValid ? "text-green-600" : "text-destructive"
                  )}>
                    {totalPercent}%
                  </TableCell>
                  <TableCell className="text-center">
                    {isValid ? (
                      <span className="text-green-600 text-xs">✓ Hợp lệ</span>
                    ) : (
                      <span className="text-destructive text-xs">Cần = 100%</span>
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {!isValid && formData.participants.length > 0 && (
            <p className="text-sm text-destructive">
              ⚠️ Tổng tỷ lệ đóng góp phải bằng đúng 100% để có thể gửi biểu mẫu.
            </p>
          )}
        </section>

        {/* Section 3: Signature */}
        <section className="border-t border-border pt-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="digitalSignature"
              checked={formData.digitalSignatureConfirmed}
              onCheckedChange={(checked) => handleInputChange('digitalSignatureConfirmed', !!checked)}
            />
            <Label htmlFor="digitalSignature" className="text-sm font-medium cursor-pointer">
              Tôi xác nhận thông tin trên là chính xác và đồng ý ký số xác nhận
            </Label>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="text-center w-full md:w-1/2">
              <p className="italic text-muted-foreground mb-2">
                TP. Hồ Chí Minh, {format(formData.submissionDate, "dd 'tháng' MM 'năm' yyyy", { locale: vi })}
              </p>
              <p className="font-bold uppercase mb-16 text-foreground">
                Tác Giả Chính / Đại Diện Nhóm Tác Giả Sáng Kiến
              </p>
              <div className="border-t border-border w-48 mx-auto pt-2">
                <p className="text-sm text-muted-foreground">(Chữ ký và ghi rõ họ tên)</p>
                {formData.digitalSignatureConfirmed && formData.mainAuthor && (
                  <p className="font-semibold text-primary mt-2">{formData.mainAuthor}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button variant="outline" className="gap-2">
            <FileText size={18} /> Xuất PDF
          </Button>
          <Button 
            className="gap-2 shadow-lg" 
            onClick={handleSubmit}
            disabled={!isValid || !formData.digitalSignatureConfirmed}
          >
            <Save size={18} /> Lưu Bản Xác Nhận
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
