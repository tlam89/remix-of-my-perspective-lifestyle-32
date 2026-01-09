import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Save, FileText, Pencil, Eye, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface EvaluationFormData {
  id: string;
  initiativeName: string;
  authorName: string;
  position: string;
  evaluationDate: Date;
  noveltyLevel: 'high' | 'medium' | 'low' | null;
  noveltyScore: number;
  noveltyComment: string;
  effectivenessLevel: 'high' | 'medium' | 'low' | null;
  effectivenessScore: number;
  effectivenessComment: string;
  conclusion: string;
  status: 'draft' | 'submitted';
  createdAt: Date;
}

interface InitiativeEvaluationFormProps {
  onVerify?: (fieldName: string, content: string) => void;
}

const NOVELTY_OPTIONS = [
  { value: 'high', label: 'Hoàn toàn mới, được triển khai, áp dụng lần đầu tiên', maxScore: 40 },
  { value: 'medium', label: 'Có cải tiến so với giải pháp đã được công bố trước đây với mức độ khá', maxScore: 28 },
  { value: 'low', label: 'Có cải tiến so với giải pháp đã được công bố trước đây với mức độ trung bình', maxScore: 20 },
];

const EFFECTIVENESS_OPTIONS = [
  { value: 'high', label: 'Có hiệu quả trong phạm vi toàn trường', maxScore: 60 },
  { value: 'medium', label: 'Có hiệu quả trong phạm vi phòng/khoa/đơn vị thuộc/trực thuộc trường', maxScore: 42 },
  { value: 'low', label: 'Ở mức độ làm cơ sở cho những sáng kiến - cải tiến kỹ thuật tiếp theo', maxScore: 30 },
];

const initialFormData: Omit<EvaluationFormData, 'id' | 'createdAt'> = {
  initiativeName: '',
  authorName: '',
  position: '',
  evaluationDate: new Date(),
  noveltyLevel: null,
  noveltyScore: 0,
  noveltyComment: '',
  effectivenessLevel: null,
  effectivenessScore: 0,
  effectivenessComment: '',
  conclusion: '',
  status: 'draft',
};

export default function InitiativeEvaluationForm({ onVerify }: InitiativeEvaluationFormProps) {
  const [evaluations, setEvaluations] = useState<EvaluationFormData[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<Omit<EvaluationFormData, 'id' | 'createdAt'>>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'submitted'>('all');

  // Calculate total score
  const totalScore = useMemo(() => {
    return currentEvaluation.noveltyScore + currentEvaluation.effectivenessScore;
  }, [currentEvaluation.noveltyScore, currentEvaluation.effectivenessScore]);

  // Get max score for selected level
  const getMaxScore = (type: 'novelty' | 'effectiveness', level: string | null) => {
    const options = type === 'novelty' ? NOVELTY_OPTIONS : EFFECTIVENESS_OPTIONS;
    const option = options.find(o => o.value === level);
    return option?.maxScore || 0;
  };

  // Filter evaluations
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(e => {
      const matchesSearch = e.initiativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [evaluations, searchQuery, statusFilter]);

  const handleInputChange = (field: keyof typeof currentEvaluation, value: string | number | Date | null) => {
    setCurrentEvaluation(prev => ({ ...prev, [field]: value }));
  };

  const handleNoveltyLevelChange = (level: 'high' | 'medium' | 'low') => {
    const maxScore = getMaxScore('novelty', level);
    setCurrentEvaluation(prev => ({
      ...prev,
      noveltyLevel: level,
      noveltyScore: maxScore, // Auto-set to max score
    }));
  };

  const handleEffectivenessLevelChange = (level: 'high' | 'medium' | 'low') => {
    const maxScore = getMaxScore('effectiveness', level);
    setCurrentEvaluation(prev => ({
      ...prev,
      effectivenessLevel: level,
      effectivenessScore: maxScore, // Auto-set to max score
    }));
  };

  const handleScoreChange = (type: 'novelty' | 'effectiveness', score: number) => {
    const level = type === 'novelty' ? currentEvaluation.noveltyLevel : currentEvaluation.effectivenessLevel;
    const maxScore = getMaxScore(type, level);
    const validScore = Math.min(Math.max(0, score), maxScore);
    
    if (type === 'novelty') {
      setCurrentEvaluation(prev => ({ ...prev, noveltyScore: validScore }));
    } else {
      setCurrentEvaluation(prev => ({ ...prev, effectivenessScore: validScore }));
    }
  };

  const createNewEvaluation = () => {
    setCurrentEvaluation(initialFormData);
    setEditingId(null);
    setViewMode('form');
  };

  const editEvaluation = (evaluation: EvaluationFormData) => {
    setCurrentEvaluation({
      initiativeName: evaluation.initiativeName,
      authorName: evaluation.authorName,
      position: evaluation.position,
      evaluationDate: evaluation.evaluationDate,
      noveltyLevel: evaluation.noveltyLevel,
      noveltyScore: evaluation.noveltyScore,
      noveltyComment: evaluation.noveltyComment,
      effectivenessLevel: evaluation.effectivenessLevel,
      effectivenessScore: evaluation.effectivenessScore,
      effectivenessComment: evaluation.effectivenessComment,
      conclusion: evaluation.conclusion,
      status: evaluation.status,
    });
    setEditingId(evaluation.id);
    setViewMode('form');
  };

  const deleteEvaluation = (id: string) => {
    setEvaluations(prev => prev.filter(e => e.id !== id));
    toast.success('Đã xóa phiếu đánh giá');
  };

  const saveEvaluation = (status: 'draft' | 'submitted') => {
    if (!currentEvaluation.initiativeName.trim()) {
      toast.error('Vui lòng nhập tên sáng kiến');
      return;
    }
    if (!currentEvaluation.authorName.trim()) {
      toast.error('Vui lòng nhập tên tác giả');
      return;
    }
    if (status === 'submitted') {
      if (!currentEvaluation.noveltyLevel) {
        toast.error('Vui lòng chọn mức độ tính mới');
        return;
      }
      if (!currentEvaluation.effectivenessLevel) {
        toast.error('Vui lòng chọn mức độ tính hiệu quả');
        return;
      }
    }

    if (editingId) {
      setEvaluations(prev => prev.map(e => 
        e.id === editingId 
          ? { ...e, ...currentEvaluation, status }
          : e
      ));
      toast.success('Đã cập nhật phiếu đánh giá');
    } else {
      const newEvaluation: EvaluationFormData = {
        ...currentEvaluation,
        id: Date.now().toString(),
        status,
        createdAt: new Date(),
      };
      setEvaluations(prev => [...prev, newEvaluation]);
      toast.success(status === 'draft' ? 'Đã lưu bản nháp' : 'Đã nộp phiếu đánh giá');
    }

    setCurrentEvaluation(initialFormData);
    setEditingId(null);
    setViewMode('list');
  };

  const cancelEdit = () => {
    setCurrentEvaluation(initialFormData);
    setEditingId(null);
    setViewMode('list');
  };

  // Render Dashboard View
  if (viewMode === 'list') {
    return (
      <Card className="border-border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Quản Lý Phiếu Đánh Giá Sáng Kiến</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Danh sách các phiếu đánh giá đã tạo
            </p>
          </div>
          <Button onClick={createNewEvaluation} className="gap-2">
            <Plus size={16} /> Tạo phiếu mới
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên sáng kiến hoặc tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                Tất cả
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('draft')}
              >
                Bản nháp
              </Button>
              <Button
                variant={statusFilter === 'submitted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('submitted')}
              >
                Đã nộp
              </Button>
            </div>
          </div>

          {/* Evaluations Table */}
          <div className="overflow-x-auto border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">STT</TableHead>
                  <TableHead>Tên sáng kiến</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead className="w-24 text-center">Điểm</TableHead>
                  <TableHead className="w-28 text-center">Trạng thái</TableHead>
                  <TableHead className="w-28 text-center">Ngày tạo</TableHead>
                  <TableHead className="w-24 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground italic py-12">
                      {evaluations.length === 0 
                        ? 'Chưa có phiếu đánh giá nào. Nhấn "Tạo phiếu mới" để bắt đầu.'
                        : 'Không tìm thấy kết quả phù hợp'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvaluations.map((evaluation, index) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{evaluation.initiativeName}</TableCell>
                      <TableCell>{evaluation.authorName}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {evaluation.noveltyScore + evaluation.effectivenessScore}/100
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={evaluation.status === 'submitted' ? 'default' : 'secondary'}>
                          {evaluation.status === 'submitted' ? 'Đã nộp' : 'Bản nháp'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {format(evaluation.createdAt, 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editEvaluation(evaluation)}
                            className="h-8 w-8"
                            disabled={evaluation.status === 'submitted'}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteEvaluation(evaluation.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Form View
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
          Phiếu Đánh Giá Sáng Kiến
        </CardTitle>
        <p className="text-sm text-muted-foreground">(Mẫu số 04)</p>
      </div>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Section 1: Metadata */}
        <section className="space-y-4">
          <div>
            <Label htmlFor="initiativeName" className="text-sm font-medium">
              1. Tên sáng kiến <span className="text-destructive">*</span>
            </Label>
            <Input
              id="initiativeName"
              placeholder="Nhập tên sáng kiến..."
              className="mt-1"
              value={currentEvaluation.initiativeName}
              onChange={(e) => handleInputChange('initiativeName', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="authorName" className="text-sm font-medium">
              2. Tác giả / đồng tác giả sáng kiến <span className="text-destructive">*</span>
            </Label>
            <Input
              id="authorName"
              placeholder="Nhập họ và tên tác giả..."
              className="mt-1"
              value={currentEvaluation.authorName}
              onChange={(e) => handleInputChange('authorName', e.target.value)}
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
                value={currentEvaluation.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Ngày đánh giá</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !currentEvaluation.evaluationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentEvaluation.evaluationDate ? (
                      format(currentEvaluation.evaluationDate, "dd 'tháng' MM 'năm' yyyy", { locale: vi })
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentEvaluation.evaluationDate}
                    onSelect={(date) => date && handleInputChange('evaluationDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </section>

        {/* Section 2: Evaluation Criteria */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">
            3. Nội dung đánh giá
          </h2>

          {/* Novelty Criterion */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">Tính mới</h3>
                <p className="text-sm text-muted-foreground">Tối đa 40 điểm</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{currentEvaluation.noveltyScore}</span>
                <span className="text-muted-foreground">/40 điểm</span>
              </div>
            </div>

            <RadioGroup
              value={currentEvaluation.noveltyLevel || ''}
              onValueChange={(value) => handleNoveltyLevelChange(value as 'high' | 'medium' | 'low')}
              className="space-y-3"
            >
              {NOVELTY_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value} id={`novelty-${option.value}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`novelty-${option.value}`} className="cursor-pointer text-sm">
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">Tối đa {option.maxScore} điểm</p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {currentEvaluation.noveltyLevel && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-sm font-medium">Điểm chấm (điểm)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={getMaxScore('novelty', currentEvaluation.noveltyLevel)}
                    value={currentEvaluation.noveltyScore || ''}
                    onChange={(e) => handleScoreChange('novelty', Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tối đa: {getMaxScore('novelty', currentEvaluation.noveltyLevel)} điểm
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nhận xét</Label>
                  <Textarea
                    placeholder="Nhập nhận xét về tính mới..."
                    className="mt-1 min-h-20"
                    value={currentEvaluation.noveltyComment}
                    onChange={(e) => handleInputChange('noveltyComment', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Effectiveness Criterion */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">Tính hiệu quả</h3>
                <p className="text-sm text-muted-foreground">Tối đa 60 điểm</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{currentEvaluation.effectivenessScore}</span>
                <span className="text-muted-foreground">/60 điểm</span>
              </div>
            </div>

            <RadioGroup
              value={currentEvaluation.effectivenessLevel || ''}
              onValueChange={(value) => handleEffectivenessLevelChange(value as 'high' | 'medium' | 'low')}
              className="space-y-3"
            >
              {EFFECTIVENESS_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value} id={`effectiveness-${option.value}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`effectiveness-${option.value}`} className="cursor-pointer text-sm">
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">Tối đa {option.maxScore} điểm</p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {currentEvaluation.effectivenessLevel && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-sm font-medium">Điểm chấm (điểm)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={getMaxScore('effectiveness', currentEvaluation.effectivenessLevel)}
                    value={currentEvaluation.effectivenessScore || ''}
                    onChange={(e) => handleScoreChange('effectiveness', Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tối đa: {getMaxScore('effectiveness', currentEvaluation.effectivenessLevel)} điểm
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nhận xét</Label>
                  <Textarea
                    placeholder="Nhập nhận xét về tính hiệu quả..."
                    className="mt-1 min-h-20"
                    value={currentEvaluation.effectivenessComment}
                    onChange={(e) => handleInputChange('effectivenessComment', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Total Score */}
          <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-bold text-lg">Tổng cộng</h3>
            <div>
              <span className="text-3xl font-bold text-primary">{totalScore}</span>
              <span className="text-muted-foreground text-lg">/100 điểm</span>
            </div>
          </div>

          {/* Conclusion */}
          <div>
            <Label className="text-sm font-medium">Kết luận</Label>
            <Textarea
              placeholder="Nhập kết luận đánh giá..."
              className="mt-1 min-h-24"
              value={currentEvaluation.conclusion}
              onChange={(e) => handleInputChange('conclusion', e.target.value)}
            />
          </div>
        </section>

        {/* Section 3: Actions */}
        <section className="border-t border-border pt-6 flex flex-wrap gap-3 justify-end">
          <Button variant="outline" onClick={cancelEdit}>
            Hủy
          </Button>
          <Button variant="secondary" onClick={() => saveEvaluation('draft')} className="gap-2">
            <Save size={16} /> Lưu bản nháp
          </Button>
          <Button onClick={() => saveEvaluation('submitted')} className="gap-2">
            <FileText size={16} /> Nộp phiếu đánh giá
          </Button>
        </section>

        {/* Footer */}
        <section className="text-center text-sm text-muted-foreground pt-4">
          <p>
            Thành phố Hồ Chí Minh, ngày {format(currentEvaluation.evaluationDate, 'dd')} tháng {format(currentEvaluation.evaluationDate, 'MM')} năm {format(currentEvaluation.evaluationDate, 'yyyy')}
          </p>
          <p className="font-semibold text-foreground mt-2">THÀNH VIÊN HỘI ĐỒNG</p>
        </section>
      </CardContent>
    </Card>
  );
}
