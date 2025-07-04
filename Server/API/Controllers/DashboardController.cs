using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DashboardController(ISaintsRepository saintsRepository, IMiraclesRepository miraclesRepository) : ControllerBase
{
    [HttpGet("saints")]
    public async Task<IActionResult> TotalSaints()
    {
        var totalSaints = await saintsRepository.GetTotalSaintsAsync();
        return Ok(totalSaints);
    }

    [HttpGet("miracles")]
    public async Task<IActionResult> TotalMiracles()
    {
        var totalMiracles = await miraclesRepository.GetTotalMiraclesAsync();
        return Ok(totalMiracles);
    }

    [HttpGet("users")]
    public async Task<IActionResult> TotalUsers()
    {
        return Ok(0);
    }
}
