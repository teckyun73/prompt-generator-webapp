export function inferDomain(text: string): string {
  const source = (text || '').toLowerCase()

  if (
    /react|next\.?js|node\.?js|api|코드|개발|앱|버그|프론트|백엔드|database|sql|python|javascript|typescript|docker|kubernetes|frontend|backend|fullstack|devops|git|deploy|microservice|rest|graphql/.test(
      source,
    )
  ) {
    return '개발'
  }
  if (
    /마케팅|광고|브랜드|캠페인|sns|블로그|콘텐츠|랜딩|카피|seo|copywriting|content marketing|social media|landing page|brand/.test(
      source,
    )
  ) {
    return '마케팅/콘텐츠'
  }
  if (/논문|연구|실험|가설|리서치|분석|보고서|research|hypothesis|experiment|whitepaper|survey|dataset/.test(source)) {
    return '연구/분석'
  }
  if (/수업|강의|학습|교육|교안|학생|튜터|curriculum|lesson|teaching|course|tutorial|learning/.test(source)) {
    return '교육'
  }
  if (
    /사업|bm|투자|시장|전략|스타트업|영업|제안서|business plan|startup|investor|pitch|revenue|go-to-market|gtm/.test(
      source,
    )
  ) {
    return '비즈니스'
  }
  return '일반'
}

export function roleForDomain(domain: string): string {
  switch (domain) {
    case '개발':
      return '시니어 소프트웨어 엔지니어이자 제품 설계자'
    case '마케팅/콘텐츠':
      return '콘텐츠 전략가이자 카피라이팅 전문가'
    case '연구/분석':
      return '리서처이자 분석 문서 작성 전문가'
    case '교육':
      return '교육 설계자이자 커리큘럼 디자이너'
    case '비즈니스':
      return '전략 컨설턴트이자 사업 문서 작성 전문가'
    default:
      return '해당 분야의 숙련된 전문가'
  }
}
