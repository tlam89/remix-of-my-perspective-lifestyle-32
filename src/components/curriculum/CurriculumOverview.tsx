import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, GraduationCap, Target, FileText, Pencil, Check, X, Plus, Trash2, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import defaultData from "@/assets/curriculum-overview-data.json";

interface CourseHeader {
  category: string;
  credits: string;
  title: string;
  description: string;
  duration: string;
  audience: string;
  format: string;
  prerequisites: string;
}

interface TeachingMethod {
  method: string;
  percentage: number;
  description: string;
}

interface GradingItem {
  item: string;
  weight: number;
}

interface RequiredMaterial {
  title: string;
  description: string;
}

interface CurriculumData {
  courseHeader: CourseHeader;
  learningObjectives: string[];
  teachingMethods: TeachingMethod[];
  gradingBreakdown: GradingItem[];
  requiredMaterials: RequiredMaterial[];
}

const STORAGE_KEY = "curriculum-overview-data";

interface CurriculumOverviewProps {
  isEditMode?: boolean;
}

export default function CurriculumOverview({ isEditMode = true }: CurriculumOverviewProps) {
  const [data, setData] = useState<CurriculumData>(defaultData);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<CurriculumData>(defaultData);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setTempData(parsed);
      } catch {
        setData(defaultData);
        setTempData(defaultData);
      }
    }
  }, []);

  const saveData = (newData: CurriculumData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    toast.success("Đã lưu thay đổi!");
  };

  const startEditing = (section: string) => {
    setTempData(JSON.parse(JSON.stringify(data)));
    setEditingSection(section);
  };

  const cancelEditing = () => {
    setTempData(data);
    setEditingSection(null);
  };

  const confirmEditing = () => {
    saveData(tempData);
    setEditingSection(null);
  };

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculum-overview-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất file JSON!");
  };

  const EditButton = ({ section }: { section: string }) => {
    if (!isEditMode) return null;
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => startEditing(section)}
        className="ml-2"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    );
  };

  const EditActions = () => (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={cancelEditing}>
        <X className="h-4 w-4 mr-1" /> Hủy
      </Button>
      <Button size="sm" onClick={confirmEditing}>
        <Check className="h-4 w-4 mr-1" /> Lưu
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={exportToJson} variant="outline">
          <Save className="h-4 w-4 mr-2" /> Xuất JSON
        </Button>
      </div>

      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              {editingSection === "header" ? (
                <>
                  <Input
                    value={tempData.courseHeader.category}
                    onChange={(e) => setTempData({
                      ...tempData,
                      courseHeader: { ...tempData.courseHeader, category: e.target.value }
                    })}
                    className="w-40"
                  />
                  <Input
                    value={tempData.courseHeader.credits}
                    onChange={(e) => setTempData({
                      ...tempData,
                      courseHeader: { ...tempData.courseHeader, credits: e.target.value }
                    })}
                    className="w-24"
                  />
                </>
              ) : (
                <>
                  <Badge variant="secondary">{data.courseHeader.category}</Badge>
                  <Badge variant="outline">{data.courseHeader.credits}</Badge>
                </>
              )}
            </div>
            {editingSection === "header" ? <EditActions /> : <EditButton section="header" />}
          </div>
          {editingSection === "header" ? (
            <>
              <Input
                value={tempData.courseHeader.title}
                onChange={(e) => setTempData({
                  ...tempData,
                  courseHeader: { ...tempData.courseHeader, title: e.target.value }
                })}
                className="text-2xl font-bold mb-2"
              />
              <Textarea
                value={tempData.courseHeader.description}
                onChange={(e) => setTempData({
                  ...tempData,
                  courseHeader: { ...tempData.courseHeader, description: e.target.value }
                })}
                className="min-h-[80px]"
              />
            </>
          ) : (
            <>
              <CardTitle className="text-2xl">{data.courseHeader.title}</CardTitle>
              <CardDescription className="text-base">{data.courseHeader.description}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Thời lượng</p>
                {editingSection === "header" ? (
                  <Input
                    value={tempData.courseHeader.duration}
                    onChange={(e) => setTempData({
                      ...tempData,
                      courseHeader: { ...tempData.courseHeader, duration: e.target.value }
                    })}
                    className="h-8"
                  />
                ) : (
                  <p className="font-medium">{data.courseHeader.duration}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Đối tượng</p>
                {editingSection === "header" ? (
                  <Input
                    value={tempData.courseHeader.audience}
                    onChange={(e) => setTempData({
                      ...tempData,
                      courseHeader: { ...tempData.courseHeader, audience: e.target.value }
                    })}
                    className="h-8"
                  />
                ) : (
                  <p className="font-medium">{data.courseHeader.audience}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Hình thức</p>
                {editingSection === "header" ? (
                  <Input
                    value={tempData.courseHeader.format}
                    onChange={(e) => setTempData({
                      ...tempData,
                      courseHeader: { ...tempData.courseHeader, format: e.target.value }
                    })}
                    className="h-8"
                  />
                ) : (
                  <p className="font-medium">{data.courseHeader.format}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Điều kiện tiên quyết</p>
                {editingSection === "header" ? (
                  <Input
                    value={tempData.courseHeader.prerequisites}
                    onChange={(e) => setTempData({
                      ...tempData,
                      courseHeader: { ...tempData.courseHeader, prerequisites: e.target.value }
                    })}
                    className="h-8"
                  />
                ) : (
                  <p className="font-medium">{data.courseHeader.prerequisites}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Mục tiêu Học tập
            </CardTitle>
            {editingSection === "objectives" ? <EditActions /> : <EditButton section="objectives" />}
          </div>
          <CardDescription>
            Kết thúc khóa học, sinh viên sẽ có khả năng:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {(editingSection === "objectives" ? tempData : data).learningObjectives.map((objective, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                {editingSection === "objectives" ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...tempData.learningObjectives];
                        newObjectives[index] = e.target.value;
                        setTempData({ ...tempData, learningObjectives: newObjectives });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newObjectives = tempData.learningObjectives.filter((_, i) => i !== index);
                        setTempData({ ...tempData, learningObjectives: newObjectives });
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <span>{objective}</span>
                )}
              </li>
            ))}
            {editingSection === "objectives" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTempData({
                  ...tempData,
                  learningObjectives: [...tempData.learningObjectives, "Mục tiêu mới"]
                })}
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm mục tiêu
              </Button>
            )}
          </ol>
        </CardContent>
      </Card>

      {/* Teaching Methods & Grading */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Phương pháp Giảng dạy</CardTitle>
              {editingSection === "methods" ? <EditActions /> : <EditButton section="methods" />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(editingSection === "methods" ? tempData : data).teachingMethods.map((method, index) => (
              <div key={index} className="space-y-2">
                {editingSection === "methods" ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={method.method}
                        onChange={(e) => {
                          const newMethods = [...tempData.teachingMethods];
                          newMethods[index] = { ...newMethods[index], method: e.target.value };
                          setTempData({ ...tempData, teachingMethods: newMethods });
                        }}
                        placeholder="Phương pháp"
                      />
                      <Input
                        type="number"
                        value={method.percentage}
                        onChange={(e) => {
                          const newMethods = [...tempData.teachingMethods];
                          newMethods[index] = { ...newMethods[index], percentage: Number(e.target.value) };
                          setTempData({ ...tempData, teachingMethods: newMethods });
                        }}
                        className="w-20"
                        placeholder="%"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMethods = tempData.teachingMethods.filter((_, i) => i !== index);
                          setTempData({ ...tempData, teachingMethods: newMethods });
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <Input
                      value={method.description}
                      onChange={(e) => {
                        const newMethods = [...tempData.teachingMethods];
                        newMethods[index] = { ...newMethods[index], description: e.target.value };
                        setTempData({ ...tempData, teachingMethods: newMethods });
                      }}
                      placeholder="Mô tả"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{method.method}</span>
                      <span className="text-muted-foreground">{method.percentage}%</span>
                    </div>
                    <Progress value={method.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </>
                )}
              </div>
            ))}
            {editingSection === "methods" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTempData({
                  ...tempData,
                  teachingMethods: [...tempData.teachingMethods, { method: "Phương pháp mới", percentage: 0, description: "" }]
                })}
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm phương pháp
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Phân bổ Điểm số</CardTitle>
              {editingSection === "grading" ? <EditActions /> : <EditButton section="grading" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(editingSection === "grading" ? tempData : data).gradingBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  {editingSection === "grading" ? (
                    <>
                      <Input
                        value={item.item}
                        onChange={(e) => {
                          const newGrading = [...tempData.gradingBreakdown];
                          newGrading[index] = { ...newGrading[index], item: e.target.value };
                          setTempData({ ...tempData, gradingBreakdown: newGrading });
                        }}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={item.weight}
                        onChange={(e) => {
                          const newGrading = [...tempData.gradingBreakdown];
                          newGrading[index] = { ...newGrading[index], weight: Number(e.target.value) };
                          setTempData({ ...tempData, gradingBreakdown: newGrading });
                        }}
                        className="w-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newGrading = tempData.gradingBreakdown.filter((_, i) => i !== index);
                          setTempData({ ...tempData, gradingBreakdown: newGrading });
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">{item.item}</span>
                      <Badge variant="secondary">{item.weight}%</Badge>
                    </>
                  )}
                </div>
              ))}
              {editingSection === "grading" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTempData({
                    ...tempData,
                    gradingBreakdown: [...tempData.gradingBreakdown, { item: "Mục mới", weight: 0 }]
                  })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Thêm mục
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Required Materials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tài liệu Bắt buộc
            </CardTitle>
            {editingSection === "materials" ? <EditActions /> : <EditButton section="materials" />}
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {(editingSection === "materials" ? tempData : data).requiredMaterials.map((material, index) => (
              <li key={index} className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                {editingSection === "materials" ? (
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={material.title}
                        onChange={(e) => {
                          const newMaterials = [...tempData.requiredMaterials];
                          newMaterials[index] = { ...newMaterials[index], title: e.target.value };
                          setTempData({ ...tempData, requiredMaterials: newMaterials });
                        }}
                        placeholder="Tiêu đề"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMaterials = tempData.requiredMaterials.filter((_, i) => i !== index);
                          setTempData({ ...tempData, requiredMaterials: newMaterials });
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <Textarea
                      value={material.description}
                      onChange={(e) => {
                        const newMaterials = [...tempData.requiredMaterials];
                        newMaterials[index] = { ...newMaterials[index], description: e.target.value };
                        setTempData({ ...tempData, requiredMaterials: newMaterials });
                      }}
                      placeholder="Mô tả"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{material.title}</p>
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  </div>
                )}
              </li>
            ))}
            {editingSection === "materials" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTempData({
                  ...tempData,
                  requiredMaterials: [...tempData.requiredMaterials, { title: "Tài liệu mới", description: "" }]
                })}
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm tài liệu
              </Button>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
