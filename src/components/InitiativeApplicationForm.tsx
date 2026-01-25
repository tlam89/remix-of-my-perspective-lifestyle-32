import React, { useState } from 'react';
import { Plus, Trash2, Save, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Author {
  id: number;
  name: string;
  dob: string;
  workplace: string;
  title: string;
  qualification: string;
  contributionPercent: number;
}

interface SupportStaff {
  id: number;
  name: string;
  dob: string;
  workplace: string;
  title: string;
  qualification: string;
  supportContent: string;
}

interface ApplicationFormState {
  unitName: string;
  authors: Author[];
  initiativeName: string;
  investorName: string;
  applicationField: string;
  firstApplyDate: string;
  typeTechnical: boolean;
  typeResearch: boolean;
  typeTextbook: boolean;
  contentSummary: string;
  confidentialInfo: string;
  conditions: string;
  authorEvaluation: string;
  trialEvaluation: string;
  supportStaff: SupportStaff[];
  submissionDay: number;
  submissionMonth: number;
  submissionYear: number;
}

interface InitiativeApplicationFormProps {
  onVerify?: (fieldName: string, content: string) => void;
  readOnly?: boolean;       // Editor & Admin: view only
  showVerifyButton?: boolean; // Only Admin can see verify button
}

const initialFormState: ApplicationFormState = {
  unitName: '',
  authors: [{ id: 1, name: '', dob: '', workplace: '', title: '', qualification: '', contributionPercent: 100 }],
  initiativeName: '',
  investorName: '',
  applicationField: '',
  firstApplyDate: '',
  typeTechnical: false,
  typeResearch: false,
  typeTextbook: false,
  contentSummary: '',
  confidentialInfo: '',
  conditions: '',
  authorEvaluation: '',
  trialEvaluation: '',
  supportStaff: [],
  submissionDay: new Date().getDate(),
  submissionMonth: new Date().getMonth() + 1,
  submissionYear: 2025,
};

export default function InitiativeApplicationForm({ onVerify, readOnly = false, showVerifyButton = false }: InitiativeApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormState>(initialFormState);

  const handleInputChange = (field: keyof ApplicationFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Author Table Logic
  const addAuthor = () => {
    const newAuthor: Author = { id: Date.now(), name: '', dob: '', workplace: '', title: '', qualification: '', contributionPercent: 0 };
    setFormData(prev => ({ ...prev, authors: [...prev.authors, newAuthor] }));
  };

  const updateAuthor = (id: number, field: keyof Author, value: any) => {
    setFormData(prev => ({
      ...prev, authors: prev.authors.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const removeAuthor = (id: number) => {
    setFormData(prev => ({ ...prev, authors: prev.authors.filter(a => a.id !== id) }));
  };

  const totalContribution = formData.authors.reduce((sum, a) => sum + Number(a.contributionPercent), 0);

  // Support Staff Table Logic
  const addSupportStaff = () => {
    const newStaff: SupportStaff = { id: Date.now(), name: '', dob: '', workplace: '', title: '', qualification: '', supportContent: '' };
    setFormData(prev => ({ ...prev, supportStaff: [...prev.supportStaff, newStaff] }));
  };

  const updateSupportStaff = (id: number, field: keyof SupportStaff, value: any) => {
    setFormData(prev => ({
      ...prev, supportStaff: prev.supportStaff.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeSupportStaff = (id: number) => {
    setFormData(prev => ({ ...prev, supportStaff: prev.supportStaff.filter(s => s.id !== id) }));
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
      {/* Header Section */}
      <CardHeader className="border-b border-border pb-4">
        
        <div className="text-center mt-6">
          <CardTitle className="text-2xl font-bold uppercase mb-2">
            ĐƠN ĐỀ NGHỊ CÔNG NHẬN SÁNG KIẾN
          </CardTitle>
          <p className="text-sm font-semibold text-muted-foreground">
            Kính gửi: Hội đồng sáng kiến Đại học Y Dược TP. Hồ Chí Minh
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* 1. Authors Table */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <label className="font-bold text-foreground">1. Tên tôi (chúng tôi) là:</label>
            <Button type="button" onClick={addAuthor} size="sm" variant="secondary" className="gap-1">
              <Plus size={14}/> Thêm tác giả
            </Button>
          </div>
          <div className="overflow-x-auto border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead className="w-28">Ngày sinh</TableHead>
                  <TableHead>Nơi công tác</TableHead>
                  <TableHead>Chức danh</TableHead>
                  <TableHead>Trình độ CM</TableHead>
                  <TableHead className="w-20">% Đóng góp</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.authors.map((author, idx) => (
                  <TableRow key={author.id}>
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={author.name} 
                        onChange={(e) => updateAuthor(author.id, 'name', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="date"
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={author.dob} 
                        onChange={(e) => updateAuthor(author.id, 'dob', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={author.workplace} 
                        onChange={(e) => updateAuthor(author.id, 'workplace', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={author.title} 
                        onChange={(e) => updateAuthor(author.id, 'title', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={author.qualification} 
                        onChange={(e) => updateAuthor(author.id, 'qualification', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1 text-center"
                        value={author.contributionPercent} 
                        onChange={(e) => updateAuthor(author.id, 'contributionPercent', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {formData.authors.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeAuthor(author.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalContribution !== 100 && (
            <p className="text-destructive text-xs mt-1">* Tổng tỷ lệ đóng góp phải là 100% (Hiện tại: {totalContribution}%)</p>
          )}
        </section>

        {/* 2. General Info */}
        <section className="space-y-4">
          <div>
            <label className="font-bold block text-foreground">2. Tên sáng kiến đề nghị công nhận:</label>
            <Input 
              className="bg-primary/5 border-primary/20"
              placeholder="Nhập tên sáng kiến..."
              value={formData.initiativeName}
              onChange={(e) => handleInputChange('initiativeName', e.target.value)}
            />
          </div>
          <div>
            <label className="font-bold block text-foreground">Chủ đầu tư tạo ra sáng kiến (nếu khác tác giả):</label>
            <Input 
              value={formData.investorName}
              onChange={(e) => handleInputChange('investorName', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold block text-foreground">Lĩnh vực áp dụng:</label>
              <Input 
                value={formData.applicationField}
                onChange={(e) => handleInputChange('applicationField', e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold block text-foreground">Ngày sáng kiến được áp dụng lần đầu:</label>
              <Input 
                type="date"
                value={formData.firstApplyDate}
                onChange={(e) => handleInputChange('firstApplyDate', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 3. Classification */}
        <section className="border border-border p-4 rounded bg-muted/30">
          <label className="font-bold block mb-2 text-foreground">3. Phân loại sáng kiến (Chọn ô phù hợp):</label>
          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox 
                checked={formData.typeTechnical} 
                onCheckedChange={(checked) => handleInputChange('typeTechnical', checked)} 
              />
              <span className="text-sm">Giải pháp kỹ thuật, quản lý, tác nghiệp, ứng dụng tiến bộ kỹ thuật áp dụng cho ĐH Y Dược TP.HCM</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox 
                checked={formData.typeResearch} 
                onCheckedChange={(checked) => handleInputChange('typeResearch', checked)} 
              />
              <span className="text-sm">Sáng kiến – cải tiến kỹ thuật từ các nghiên cứu khoa học (đã đăng tạp chí/hội nghị)</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox 
                checked={formData.typeTextbook} 
                onCheckedChange={(checked) => handleInputChange('typeTextbook', checked)} 
              />
              <span className="text-sm">Sáng kiến – cải tiến kỹ thuật từ sách, giáo trình, tài liệu tham khảo</span>
            </label>
          </div>
        </section>

        {/* 4. Content Details */}
        <section className="space-y-4">
          <div>
            <label className="font-bold block mb-1 text-foreground">4. Nội dung của sáng kiến:</label>
            <p className="text-xs italic text-muted-foreground mb-1">(Mô tả ngắn gọn, đầy đủ các bước thực hiện, kết quả, hiệu quả thử nghiệm)</p>
            <Textarea 
              className="min-h-32"
              value={formData.contentSummary}
              onChange={(e) => handleInputChange('contentSummary', e.target.value)}
            />
            <VerifyButton fieldName="Nội dung của sáng kiến" content={formData.contentSummary} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-1 text-foreground">Thông tin cần bảo mật (nếu có):</label>
              <Textarea 
                className="min-h-20"
                value={formData.confidentialInfo}
                onChange={(e) => handleInputChange('confidentialInfo', e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-foreground">Các điều kiện cần thiết để áp dụng:</label>
              <Textarea 
                className="min-h-20"
                value={formData.conditions}
                onChange={(e) => handleInputChange('conditions', e.target.value)}
              />
              <VerifyButton fieldName="Điều kiện cần thiết để áp dụng" content={formData.conditions} />
            </div>
          </div>
        </section>

        {/* 5. Evaluations */}
        <section className="space-y-4">
          <div>
            <label className="font-bold block mb-1 text-foreground">5. Đánh giá lợi ích (theo ý kiến tác giả):</label>
            <Textarea 
              className="min-h-24"
              placeholder="Lợi ích thu được hoặc dự kiến..."
              value={formData.authorEvaluation}
              onChange={(e) => handleInputChange('authorEvaluation', e.target.value)}
            />
            <VerifyButton fieldName="Đánh giá lợi ích (tác giả)" content={formData.authorEvaluation} />
          </div>
          <div>
            <label className="font-bold block mb-1 text-foreground">6. Đánh giá lợi ích (theo đơn vị áp dụng thử):</label>
            <Textarea 
              className="min-h-24"
              placeholder="Ý kiến của tổ chức, cá nhân đã tham gia áp dụng..."
              value={formData.trialEvaluation}
              onChange={(e) => handleInputChange('trialEvaluation', e.target.value)}
            />
            <VerifyButton fieldName="Đánh giá lợi ích (đơn vị áp dụng)" content={formData.trialEvaluation} />
          </div>
        </section>

        {/* 7. Support Staff Table */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <label className="font-bold text-foreground">7. Danh sách người tham gia áp dụng thử/lần đầu (nếu có):</label>
            <Button type="button" onClick={addSupportStaff} size="sm" variant="secondary" className="gap-1">
              <Plus size={14}/> Thêm người hỗ trợ
            </Button>
          </div>
          <div className="overflow-x-auto border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead className="w-28">Ngày sinh</TableHead>
                  <TableHead>Nơi công tác</TableHead>
                  <TableHead>Chức danh</TableHead>
                  <TableHead>Trình độ CM</TableHead>
                  <TableHead>Nội dung hỗ trợ</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.supportStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="p-4 text-center italic text-muted-foreground">
                      Không có người hỗ trợ
                    </TableCell>
                  </TableRow>
                )}
                {formData.supportStaff.map((staff, idx) => (
                  <TableRow key={staff.id}>
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={staff.name} 
                        onChange={(e) => updateSupportStaff(staff.id, 'name', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="date"
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={staff.dob} 
                        onChange={(e) => updateSupportStaff(staff.id, 'dob', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={staff.workplace} 
                        onChange={(e) => updateSupportStaff(staff.id, 'workplace', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={staff.title} 
                        onChange={(e) => updateSupportStaff(staff.id, 'title', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={staff.qualification} 
                        onChange={(e) => updateSupportStaff(staff.id, 'qualification', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        className="border-0 border-b rounded-none focus-visible:ring-0 px-1"
                        value={staff.supportContent} 
                        onChange={(e) => updateSupportStaff(staff.id, 'supportContent', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSupportStaff(staff.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Footer */}
        <section className="pt-8 border-t border-border">
          <p className="italic text-sm text-center mb-6 text-muted-foreground">
            Tôi xin cam đoan mọi thông tin nêu trong đơn là trung thực, đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật.
          </p>
          
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="text-center w-full md:w-1/2">
              <p className="font-bold uppercase text-foreground">Xác nhận của lãnh đạo đơn vị</p>
              <div className="h-32 mt-4 border border-dashed border-border rounded flex items-center justify-center text-muted-foreground">
                (Ký và đóng dấu)
              </div>
            </div>
            <div className="text-center w-full md:w-1/2">
              <p className="italic mb-2 text-foreground">
                TP. Hồ Chí Minh, ngày{' '}
                <Input 
                  type="number" 
                  className="w-12 inline-block text-center mx-1" 
                  value={formData.submissionDay} 
                  onChange={(e) => handleInputChange('submissionDay', e.target.value)} 
                />{' '}
                tháng{' '}
                <Input 
                  type="number" 
                  className="w-12 inline-block text-center mx-1" 
                  value={formData.submissionMonth} 
                  onChange={(e) => handleInputChange('submissionMonth', e.target.value)} 
                />{' '}
                năm {formData.submissionYear}
              </p>
              <p className="font-bold uppercase text-foreground">Tác giả sáng kiến</p>
              <div className="h-32 mt-4 border border-dashed border-border rounded flex items-center justify-center text-muted-foreground">
                (Ký và ghi rõ họ tên)
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button variant="outline" className="gap-2">
            <FileText size={18} /> Xem trước PDF
          </Button>
          <Button className="gap-2 shadow-lg">
            <Save size={18} /> Lưu Hồ Sơ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
