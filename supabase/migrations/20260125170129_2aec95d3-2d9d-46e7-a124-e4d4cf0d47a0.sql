-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create curriculum tables for admin management
CREATE TABLE public.curriculum_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.curriculum_semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.curriculum_classes(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(class_id, code)
);

CREATE TABLE public.curriculum_ues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID REFERENCES public.curriculum_semesters(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'primary',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.curriculum_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ue_id UUID REFERENCES public.curriculum_ues(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    total_points NUMERIC NOT NULL DEFAULT 100,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.curriculum_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.curriculum_subjects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    coefficient NUMERIC NOT NULL,
    max_points NUMERIC NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all curriculum tables
ALTER TABLE public.curriculum_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_ues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_evaluations ENABLE ROW LEVEL SECURITY;

-- Everyone can read curriculum data
CREATE POLICY "Everyone can read classes" ON public.curriculum_classes FOR SELECT USING (true);
CREATE POLICY "Everyone can read semesters" ON public.curriculum_semesters FOR SELECT USING (true);
CREATE POLICY "Everyone can read ues" ON public.curriculum_ues FOR SELECT USING (true);
CREATE POLICY "Everyone can read subjects" ON public.curriculum_subjects FOR SELECT USING (true);
CREATE POLICY "Everyone can read evaluations" ON public.curriculum_evaluations FOR SELECT USING (true);

-- Only admins can modify curriculum data
CREATE POLICY "Admins can insert classes" ON public.curriculum_classes FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update classes" ON public.curriculum_classes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete classes" ON public.curriculum_classes FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert semesters" ON public.curriculum_semesters FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update semesters" ON public.curriculum_semesters FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete semesters" ON public.curriculum_semesters FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert ues" ON public.curriculum_ues FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ues" ON public.curriculum_ues FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete ues" ON public.curriculum_ues FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert subjects" ON public.curriculum_subjects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update subjects" ON public.curriculum_subjects FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subjects" ON public.curriculum_subjects FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert evaluations" ON public.curriculum_evaluations FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update evaluations" ON public.curriculum_evaluations FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete evaluations" ON public.curriculum_evaluations FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_curriculum_classes_updated_at BEFORE UPDATE ON public.curriculum_classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_curriculum_semesters_updated_at BEFORE UPDATE ON public.curriculum_semesters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_curriculum_ues_updated_at BEFORE UPDATE ON public.curriculum_ues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_curriculum_subjects_updated_at BEFORE UPDATE ON public.curriculum_subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_curriculum_evaluations_updated_at BEFORE UPDATE ON public.curriculum_evaluations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();