/**
 * @typedef {import("express").Request["query"][any]} ReqQueryProp
 */
export const ParseQuery = {
  /**
   * 
   * @param {ReqQueryProp} args 
   * @returns {string | undefined}
   */
  str: (args) => typeof args === "string" ? args : undefined,
  /**
   * 
   * @param {ReqQueryProp} args 
   * @returns {string[] | undefined}
   */
  arrStr: (args) => typeof args === "string" ? args.split(",") : undefined,
  /**
  * 
  * @param {ReqQueryProp} args 
  * @returns {number | undefined}
  */
  num: (args) => typeof args === "string" && !isNaN(+args) ? +args : undefined,
  /**
   * 
   * @param {ReqQueryProp} args 
   * @returns {boolean | undefined}
   */
  bool: (args) => typeof args === "string" && ["true", "false"].includes(args) ? !!JSON.parse(args) : undefined,
  /**
   * 
   * @param {ReqQueryProp} args 
   * @returns {number[] | undefined}
   */
  arrNum(args) {
    const parsedStr = this.arrStr(args);
    return !!parsedStr && parsedStr.every((e) => !isNaN(+e)) ? parsedStr.map((e) => +e) : undefined
  }
}
